const error = (message: string, statusCode = 500) => {
  const err = Error(message);
  return ({
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stack: err.stack, message: err.message }, null, 2),
  });
};

export const noBodyError = () => error('No body recieved');
export default error;
