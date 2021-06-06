import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import error from '../../lib/responseHelpers/error';
import response from '../../lib/responseHelpers/result';
import user from '../../models/userModel';
import { AWSGatewayProxyFunction } from '../../types';
import env from '../../lib/config';

const loginHandler: AWSGatewayProxyFunction = async (event) => {
  if (!env.SECRET) { return error('Environment not set up correctly - cannot make user'); }
  if (!event.body) { return error('No body recieved'); }
  const parsedBody = validateBody(event.body);
  if (!parsedBody) { return error('Invalid body'); }

  const validUser = await user.findOne({ username: parsedBody.username }).select('hash').exec();
  const success = await bcrypt.compare(parsedBody.password, validUser?.hash || '');

  if (validUser?.hash && success) {
    // TODO move to separate function
    const token = jwt.sign({ id: validUser.id }, env.SECRET, { expiresIn: 60 * 60 * 24 });
    return response({ success }, 200, {
      'Set-Cookie': `token=${token}`,
    });
  }
  return error('Invalid user', 503);
};

const validateBody = (rawJson: string) => {
  const body = JSON.parse(rawJson);
  const { username, password } = body;
  if (username && password) { return { username, password }; }

  return false;
};

export default loginHandler;
