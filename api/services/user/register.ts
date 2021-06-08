import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import env from '../../lib/config';
import error, { noBodyError } from '../../lib/responseHelpers/error';
import result from '../../lib/responseHelpers/result';
import user from '../../models/userModel';
import { AWSGatewayProxyFunction } from '../../types';

const registerHandler: AWSGatewayProxyFunction = async (event) => {
  if (!env.SECRET) { return error('Environment not set up correctly - cannot make user'); }
  if (!event.body) { return noBodyError(); }
  const parsedBody = validateBody(event.body);
  if (!parsedBody) { return error('Invalid body'); }

  const hash = await bcrypt.hash(parsedBody.password, 10);
  try {
    const { username, id } = await user.create({
      hash,
      name: parsedBody.name,
      username: parsedBody.username,
    });
    const token = jwt.sign({ id }, env.SECRET, { expiresIn: 60 * 60 * 24 });
    return result({ user: { username, id }, token }, 200, { 'Set-Cookie': `token=${token}` });
  } catch (err) {
    return (err);
  }
};

const validateBody = (rawJson: string) => {
  const body = JSON.parse(rawJson);
  const { name, username, password } = body;
  if (name && username && password) { return { name, username, password }; }

  return false;
};

export default registerHandler;
