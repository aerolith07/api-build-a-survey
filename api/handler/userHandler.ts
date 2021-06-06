import connectMongo from '../lib/mongoose';
import loginHandler from '../services/user/login';
import logoutHandler from '../services/user/logout';
import registerHandler from '../services/user/register';

const initServer = async () => {
  await connectMongo();
};

export const login = async (data: any) => {
  await initServer();
  return loginHandler(data);
};

export const register = async (data: any) => {
  await initServer();
  return registerHandler(data);
};

export const logout = async (data: any) => {
  await initServer();
  return logoutHandler(data);
};
