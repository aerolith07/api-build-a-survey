const logoutHandler = async (event: any) => ({
  statusCode: 200,
  body: JSON.stringify(
    {
      message: 'register',
      input: event,
    },
    null,
    2,
  ),
});

export default logoutHandler;
