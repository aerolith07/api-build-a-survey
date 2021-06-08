import {
  QuestionType, QuestionGroupFE, SurveyDataFrontend, SurveyDataDB,
} from './surveyTypes';

export const transformSurveyDataForDB = (surveyData: SurveyDataFrontend):SurveyDataDB => {
  const { order, questions } = surveyData;
  return {
    questions: transformQuestionsForDB(questions),
    order: order.map(({ type, id }) => ({ type, questionId: id })),
  };
};

export const transformSurveyDataForFE = (surveyData: SurveyDataDB): SurveyDataFrontend => {
  const { order, questions } = surveyData;
  return {
    questions: transformQuestionsForFE(questions),
    order: order.map(({ type, questionId }) => ({ type, id: questionId })),
  };
};

const transformQuestionsForFE = (questions: QuestionType[]) => questions.map((question) => {
  const { questionType: type, questionId: id, ...content } = question;
  return ({ [type]: { [id]: { ...content } } });
}).reduce((arr, current) => ({ ...arr, ...current }));

const transformQuestionsForDB = (questions: QuestionGroupFE) => {
  const transformedQuestionGroups = Object.entries(questions)
    .map(([questionType, questionGroup]) => Object.entries(questionGroup)
      .map(([questionId, content]) => ({ questionType, questionId, ...content })));
  return transformedQuestionGroups.reduce((prev, curr) => [...prev, ...curr]);
};
