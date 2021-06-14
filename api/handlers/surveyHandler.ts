import connectMongo from '../lib/mongoose';
import error, { noUserIdError } from '../lib/responseHelpers/error';
import {
  createSurveyHandler,
  surveyBySurveyIdHandler,
  surveyByUserIdHandler,
  setSurveyPublishHandler,
  updateSurveyHandler,
} from '../services/survey/surveys';
import { AWSGatewayProxyFunction } from '../types';
import getUserId from './common';

const initServer = async () => {
  await connectMongo();
};

export const createSurvey:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  if (!userId) { return noUserIdError(); }
  return createSurveyHandler(event, userId).catch((err) => error(err.message));
};

export const updateSurvey:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  if (!userId) { return noUserIdError(); }
  return updateSurveyHandler(event, userId).catch((err) => error(err.message));
};

export const setSurveyPublish:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  if (!userId) { return noUserIdError(); }
  return setSurveyPublishHandler(event, userId).catch((err) => error(err.message));
};

export const surveysByUser:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  if (!userId) { return noUserIdError(); }
  return surveyByUserIdHandler(event, userId).catch((err) => error(err.message));
};

export const surveyById:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  if (!userId) { return noUserIdError(); }
  return surveyBySurveyIdHandler(event, userId).catch((err) => error(err.message));
};
