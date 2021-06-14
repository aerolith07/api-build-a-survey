import { APIGatewayProxyEvent } from 'aws-lambda';
import error from '../../lib/responseHelpers/error';
import response from '../../lib/responseHelpers/result';
import { transformSurveyDataForDB, transformSurveyDataForFE } from '../../lib/transformers/surveyTransformers';
import { SurveyDataFrontend } from '../../lib/transformers/surveyTypes';
import surveyModel from '../../models/surveyModel';
import { AWSGatewayProxyFunctionWithId } from '../../types';

export const createSurveyHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const surveyData = getSurveyData(data);
  return surveyModel.create({ user: userId, ...surveyData })
    .then((res) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { survey, ...surveyResponse } = res.toObject();
      return response({ ...surveyResponse, numberOfQuestions: survey.order.length });
    })
    .catch((err) => error(err.message));
};

export const updateSurveyHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const id = getSurveyId(data);
  const surveyData = getSurveyData(data);
  return surveyModel.findOneAndUpdate({ _id: id, user: userId }, surveyData, { new: true })
    .then((res) => {
      if (!res) { return error('No survey found to update'); }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { survey, ...surveyResponse } = res.toObject();
      return response({ ...surveyResponse, numberOfQuestions: survey.order.length });
    })
    .catch((err) => error(err.message));
};

export const setSurveyPublishHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const id = getSurveyId(data);
  if (!data.body) { throw Error('no body'); }
  const { published }: {published: boolean} = JSON.parse(data.body);
  if (published === undefined) { return error('Invalid body'); }

  return surveyModel.findOneAndUpdate({ _id: id, user: userId }, { published }, { new: true })
    .then((res) => {
      if (!res) { return error('No survey found to update'); }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { survey, ...surveyResponse } = res.toObject();
      return response(surveyResponse);
    })
    .catch((err) => error(err.message));
};

export const surveyBySurveyIdHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const id = getSurveyId(data);
  const surveyData = await surveyModel.findById(id).exec();
  if (!surveyData) { return error(`no survey found with ID ${id}`, 404); }

  // TODO return survey if it belongs to user, or if it is published
  const isSurveyOwner = surveyData.user.toString() === userId;
  const isPublished = surveyData.published;
  if (!(isPublished || isSurveyOwner)) { return error('This survey is currently unpublished', 403); }

  const transformedSurvey = transformSurveyDataForFE(surveyData.toObject().survey);
  return response(transformedSurvey);
};

export const surveyByUserIdHandler: AWSGatewayProxyFunctionWithId = async (_data, userId) => {
  console.log('data', userId);
  const surveys = await surveyModel.find({ user: userId }).exec();
  const surveysData = surveys.map((surveyData) => {
    const { survey: _survey, ...rest } = surveyData.toObject();
    return rest;
  });

  // console.log('data', surveysData);
  return response({ survey: surveysData });
};

const getSurveyId = (data:APIGatewayProxyEvent) => {
  if (!data?.pathParameters?.id) { throw Error('id required to find survey by survey id'); }
  console.log('survey id:', data.pathParameters.id);

  return data.pathParameters.id;
};

const getSurveyData = (data:APIGatewayProxyEvent) => {
  if (!data.body) { throw Error('no body'); }
  const survey:SurveyDataFrontend = JSON.parse(data.body);
  const surveyData = transformSurveyDataForDB(survey);
  if (!surveyData.order || !surveyData.questions) { throw Error('invalid body'); }
  if (survey.questions.title && survey.order) {
    const firstTitle = survey.order.find((question) => question.type === 'title');
    if (!firstTitle) { throw Error('no title'); }
  }
  return { survey: surveyData };
};
