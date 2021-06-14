import { APIGatewayProxyEvent } from 'aws-lambda';
import jwt from 'jsonwebtoken';
import env from '../lib/config';

const getUserId = (event: APIGatewayProxyEvent) => {
  if (env.BUILD_STAGE === 'LOCAL') {
    const token = event?.headers?.Authorization?.split(' ')[1];
    console.log('local', event);
    console.log('local', token);

    if (token) {
      const decoded: any = jwt.verify(token, env.SECRET || '');
      console.log(`user id: ${decoded.id}`);
      return decoded.id;
    }
  }

  const token = event?.requestContext?.authorizer?.lambda?.decoded?.id;
  if (!token) { return false; }
  return token;
};

export default getUserId;
