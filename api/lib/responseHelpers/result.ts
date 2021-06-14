const response = (data: {}, statusCode = 200, additionalHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:3001',
    'Access-Control-Allow-Credentials': true,
    ...additionalHeaders,
  },
  body: JSON.stringify({ ...data, status: true }, null, 2),
});
export default response;
