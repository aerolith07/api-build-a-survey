import connectMongo from '../lib/mongoose';
import error from '../lib/responseHelpers/error';
import {
  createSurveyHandler,
  surveyBySurveyIdHandler,
  surveyByUserIdHandler,
  toggleSurveyPublishHandler,
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
  return createSurveyHandler(event, userId).catch((err) => error(err.message));
};

export const updateSurvey:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  return updateSurveyHandler(event, userId).catch((err) => error(err.message));
};

export const toggleSurveyPublish:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  return toggleSurveyPublishHandler(event, userId).catch((err) => error(err.message));
};

export const surveysByUser:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  const userId = getUserId(event);
  return surveyByUserIdHandler(event, userId).catch((err) => error(err.message));
};

export const surveyById:AWSGatewayProxyFunction = async (event) => {
  await initServer();
  return surveyBySurveyIdHandler(event).catch((err) => error(err.message));
};
