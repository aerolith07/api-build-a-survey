const response = (data: {}, statusCode = 200, additionalHeaders = {}) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...additionalHeaders },
  body: JSON.stringify(data, null, 2),
});
export default response;
