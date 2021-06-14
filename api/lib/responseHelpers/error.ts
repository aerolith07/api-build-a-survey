const error = (message: string, statusCode = 500) => {
  const err = Error(message);
  return ({
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      statusCode, message: err.message, status: false, stack: err.stack,
    }, null, 2),
  });
};

export const noBodyError = () => error('No body recieved', 400);
export const noUserIdError = () => error('No user id found', 400);
export default error;
