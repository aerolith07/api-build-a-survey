import { APIGatewayProxyEvent } from 'aws-lambda';
import error from '../../lib/responseHelpers/error';
import response from '../../lib/responseHelpers/result';
import answerModel, { AnswerType } from '../../models/answerModel';
import surveyModel from '../../models/surveyModel';
import { AWSGatewayProxyFunction, AWSGatewayProxyFunctionWithId } from '../../types';

export const submitAnswerHandler: AWSGatewayProxyFunction = async (event) => {
  const surveyId = getSurveyId(event);
  const answers = getAnswers(event);

  return answerModel.create({ surveyId, answers })
    .then((res) => response(res))
    .catch((err) => error(err.message));
};

export const surveyResultsHandler: AWSGatewayProxyFunctionWithId = async (event, userId) => {
  const surveyId = getSurveyId(event);
  const survey = surveyModel.find({ id: surveyId, userId });
  if (!survey) { return error('no survey'); }

  const answers = await answerModel.find({ surveyId }).exec();
  return response(answers);
};

const getSurveyId = (event:APIGatewayProxyEvent) => {
  if (!event?.pathParameters?.id) { throw Error('id required to find survey by survey id'); }
  return event?.pathParameters?.id;
};

const getAnswers = (event:APIGatewayProxyEvent) => {
  if (!event.body) { throw Error('no body'); }
  const answers: AnswerType[] = JSON.parse(event.body);
  // const surveyData = transformSurveyDataForDB(survey);
  if (!answers) { throw Error('invalid body'); }

  return { answers };
};
