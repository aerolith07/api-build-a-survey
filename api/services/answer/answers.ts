import { APIGatewayProxyEvent } from 'aws-lambda';
import error from '../../lib/responseHelpers/error';
import response from '../../lib/responseHelpers/result';
import answerModel, { AnswerType } from '../../models/answerModel';
import surveyModel from '../../models/surveyModel';
import { AWSGatewayProxyFunction, AWSGatewayProxyFunctionWithId } from '../../types';

export const submitAnswerHandler: AWSGatewayProxyFunction = async (event) => {
  const surveyId = getSurveyId(event);
  const answers = getAnswers(event);

  return answerModel.create({ answer: answers })
    .then((newAnswers) => surveyModel.findById(surveyId)
      .then((surveySchema) => {
        if (!surveySchema) { throw new Error(`No survey found with id: ${surveyId}`); }
        surveySchema.update({ $push: { answers: newAnswers.id } }, { new: true }).exec();

        answers.forEach((answer) => {
          const question = surveySchema.survey.questions.find(
            (ques) => ques.questionId === answer.id,
          );
          if (!question) { throw new Error(`question with id ${answer.id} not found, title: ${answer.title}`); }
          question.total += 1;

          answer.options.forEach((answerOption) => {
            const option = question.options.find((queOpt) => queOpt.id === answerOption.id);
            if (!option) { throw new Error(`option with id: ${answerOption.id} not found, value: ${answerOption.value}, title: ${answer.title}`); }

            if (!!(answerOption.value) === true) {
              option.count += 1;
            }
          });
        });
        return surveySchema.save();
      }))
    .then((res) => {
      if (!res) { return error('No survey found to update'); }
      return response({ success: true });
    })
    .catch((err) => error(err.message));
};

export const surveyResultsHandler: AWSGatewayProxyFunctionWithId = async (event, userId) => {
  const surveyId = getSurveyId(event);
  const survey = surveyModel.find({ id: surveyId, userId });
  if (!survey) { return error('no survey'); }

  const answers = await surveyModel.findById(surveyId).populate('answers').exec();
  if (!answers) { return error('no answers found'); }
  return response(answers.toObject());
};

const getSurveyId = (event:APIGatewayProxyEvent) => {
  if (!event?.pathParameters?.id) { throw Error('id required to find survey by survey id'); }
  return event?.pathParameters?.id;
};

const getAnswers = (event:APIGatewayProxyEvent) => {
  if (!event.body) { throw Error('no body'); }
  const { answers }: {answers:AnswerType[]} = JSON.parse(event.body);
  // const surveyData = transformSurveyDataForDB(survey);
  if (!answers) { throw Error('invalid body'); }

  return answers;
};
