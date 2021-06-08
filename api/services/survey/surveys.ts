import { APIGatewayProxyEvent } from 'aws-lambda';
import error from '../../lib/responseHelpers/error';
import response from '../../lib/responseHelpers/result';
import { transformSurveyDataForDB, transformSurveyDataForFE } from '../../lib/transformers/surveyTransformers';
import { SurveyDataFrontend } from '../../lib/transformers/surveyTypes';
import surveyModel from '../../models/surveyModel';
import { AWSGatewayProxyFunction, AWSGatewayProxyFunctionWithId } from '../../types';

export const createSurveyHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const surveyData = getSurveyData(data);

  return surveyModel.create({ user: userId, surveyData })
    .then((res) => response(res))
    .catch((err) => error(err.message));
};

export const updateSurveyHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const id = getSurveyId(data);
  const surveyData = getSurveyData(data);

  return surveyModel.findOneAndUpdate({ id, user: userId }, surveyData, { new: true })
    .then((res) => {
      if (!res) { return error('No survey found to update'); }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { survey, ...surveyResponse } = res.toObject();
      return response(surveyResponse);
    })
    .catch((err) => error(err.message));
};

export const toggleSurveyPublishHandler: AWSGatewayProxyFunctionWithId = async (data, userId) => {
  const id = getSurveyId(data);
  if (!data.body) { throw Error('no body'); }
  const { published }: {published: boolean} = JSON.parse(data.body);
  if (published === undefined) { throw Error('invalid body'); }

  console.log(id, userId);

  return surveyModel.findOneAndUpdate({ _id: id, user: userId }, { published }, { new: true })
    .then((res) => {
      if (!res) { return error('No survey found to update'); }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { survey, ...surveyResponse } = res.toObject();
      return response(surveyResponse);
    })
    .catch((err) => error(err.message));
};

export const surveyBySurveyIdHandler: AWSGatewayProxyFunction = async (data) => {
  const id = getSurveyId(data);
  const surveyData = await surveyModel.findById(id).exec();
  if (!surveyData) { return error(`no survey found with ID ${id}`, 404); }
  if (!surveyData.published) { return error('This survey is currently unpublished', 403); }

  const transformedSurvey = transformSurveyDataForFE(surveyData.survey);
  return response({ transformedSurvey });
};

export const surveyByUserIdHandler: AWSGatewayProxyFunctionWithId = async (_data, userId) => {
  const survey = await surveyModel.find({ user: userId })
    .select('id')
    .select('published')
    .select('createdAt')
    .select('updatedAt')
    .exec();
  return response({ survey });
};

const getSurveyId = (data:APIGatewayProxyEvent) => {
  if (!data?.pathParameters?.id) { throw Error('id required to find survey by survey id'); }
  return data?.pathParameters?.id;
};

const getSurveyData = (data:APIGatewayProxyEvent) => {
  if (!data.body) { throw Error('no body'); }
  const survey:SurveyDataFrontend = JSON.parse(data.body);
  const surveyData = transformSurveyDataForDB(survey);
  if (!surveyData.order || !surveyData.questions) { throw Error('invalid body'); }

  return { survey: surveyData };
};
