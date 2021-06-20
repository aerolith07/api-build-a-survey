export type SurveyDataFrontend = {
  questions: QuestionGroupFE
  order: OrderTypeFE[]
}

export type OrderTypeFE = {
  type: string, id: string
}

export type OrderTypeDB = {
  type: string, questionId: string
}

export type SurveyDataDB = {
  questions: QuestionType[]
  order: OrderTypeDB[]
}

export type QuestionGroupFE = {
  [key: string]: {
    [key: string]: QuestionFrontend
  }
}

export type QuestionStoreProperties = {
  questionId: string,
  questionType: string,
  total: number,
  options: { id: string, value: string, count: string}[]
}

export type QuestionFrontend = {
  title: string,
  subheading: string,
  options: { id: string, value: string }[]
}

export type QuestionType = (QuestionStoreProperties & QuestionFrontend)
