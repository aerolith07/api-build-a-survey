import { Callback, Context, APIGatewayTokenAuthorizerEvent } from 'aws-lambda';

const generatePolicy = (principalId: string, effect: string, resource: string) => {
  const authResponse = {
    policyDocument: null,
    principalId,
  };
  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [],
    };
    const statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    };
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};

module.exports.authorize = (event: APIGatewayTokenAuthorizerEvent,
  _context: Context, callback: Callback) => {
  console.log('==================');
  console.log('Authorization');
  console.log('==================');
  const token = event.authorizationToken;

  if (token) {
    callback(null, generatePolicy('user', 'Allow', '*'));
  } else {
    callback(null, generatePolicy('user', 'Deny', '*'));
  }
};
