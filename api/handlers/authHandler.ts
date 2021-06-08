import { APIGatewayRequestAuthorizerEvent, Callback, Context } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import env from '../lib/config';

module.exports.authorize = (
  event: APIGatewayRequestAuthorizerEvent,
  _context: Context,
  callback: Callback,
) => {
  console.log('==================');
  console.log('Authorization');
  console.log('==================');

  const authHeader = event?.headers?.authorization;
  const token = authHeader?.split(' ')[1];

  if (token && env.SECRET) {
    const decoded = jwt.verify(token, env.SECRET);

    callback(null, {
      isAuthorized: true,
      context: {
        decoded,
      },
    });
  }

  callback(null, {
    isAuthorized: false,
    context: {
      event,
      token,
      authHeader,
    },
  });
};
