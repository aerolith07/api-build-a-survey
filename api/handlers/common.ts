import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import env from '../lib/config';
import { noUserIdError } from '../lib/responseHelpers/error';

const getUserId = (event: APIGatewayProxyEvent) => {
  if (env.BUILD_STAGE === 'LOCAL') {
    const token = event?.headers?.Cookie?.split(' ')[0].split('=')[1];

    if (token) {
      const decoded: any = jwt.verify(token, env.SECRET || '');
      console.log(`user id: ${decoded.id}`);
      return decoded.id;
    }
  }

  const token = event?.requestContext?.authorizer?.lambda?.decoded?.id;
  if (!token) { throw noUserIdError; }
  return token;
};

export default getUserId;
