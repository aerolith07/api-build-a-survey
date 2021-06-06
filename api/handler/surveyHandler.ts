import connectMongo from '../lib/mongoose';
import surveysHandler from '../services/survey/surveys';

const initServer = async (data) => {
  await connectMongo();
};

export const surveys = async (data: any) => {
  console.log(data);

  await initServer(data.pathParameters.id);
  return surveysHandler(data);
};

// export const register = async (data: any) => {
//   await initServer();
//   return registerHandler(data);
// };

// export const logout = async (data: any) => {
//   await initServer();
//   return logoutHandler(data);
// };
