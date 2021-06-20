import connectMongo from '../lib/mongoose';
import error from '../lib/responseHelpers/error';
import {
  submitAnswerHandler,
  surveyResultsHandler,
} from '../services/answer/answers';
import { AWSGatewayProxyFunction } from '../types';
import getUserId from './common';

const initServer = async () => {
  await connectMongo();
};

export const submit:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  return submitAnswerHandler(event).catch((err) => error(err.message));
};

export const results:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  console.log('results');
  const userId = getUserId(event);
  return surveyResultsHandler(event, userId).catch((err) => error(err.message));
};
