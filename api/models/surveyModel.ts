import { model, Schema, Types } from 'mongoose';
import { OrderTypeDB, QuestionType } from '../lib/transformers/surveyTypes';
import answerModel, { AnswerType } from './answerModel';
import userModel from './userModel';

const RequiredString = { type: String, required: true };
const RequiredNumber = { type: Number, required: true };
const MAX_LENGTH = 2;

export interface SurveyDataType {
  user: string
  survey: {
    questions: QuestionType[]
    order: OrderTypeDB[]
  }
  published: boolean,
  answers: AnswerType[]
}

const OrderSchema = new Schema<OrderTypeDB>({
  questionId: { ...RequiredString },
  type: { ...RequiredString },
});

const QuestionSchema = new Schema<QuestionType>({
  questionId: { ...RequiredString },
  questionType: { ...RequiredString },
  title: { ...RequiredString },
  subheading: { type: String },
  total: { ...RequiredNumber, default: 0, select: true },
  options: [{
    id: { ...RequiredString },
    value: { type: String },
    count: { ...RequiredNumber, default: 0, select: true },
  }],
});

function validateLength<AnyArray>(value: AnyArray[]) {
  console.log(value.length < MAX_LENGTH);
  return value.length < MAX_LENGTH;
}

const surveySchema = new Schema<SurveyDataType>({
  user: {
    type: Types.ObjectId, ref: userModel, required: true,
  },
  survey: {
    questions: { type: [QuestionSchema], validator: validateLength },
    order: { type: [OrderSchema], validator: validateLength },
  },
  published: { type: Boolean, required: true, default: false },
  answers: [{
    type: Types.ObjectId, ref: answerModel,
  }],
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

surveySchema.virtual('title').get(function getit(this: SurveyDataType) {
  const firstTitle = this.survey.order.find((question: { type: string; }) => question.type === 'title');
  if (!firstTitle) { return 'untitled'; }
  return this.survey.questions.find(((q) => firstTitle.questionId === q.questionId))?.title;
});

export default model<SurveyDataType>('surveys', surveySchema);
