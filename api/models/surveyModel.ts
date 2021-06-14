import { model, Schema, Types } from 'mongoose';
import { OrderTypeDB, QuestionType } from '../lib/transformers/surveyTypes';
import userModel from './userModel';

const RequiredString = { type: String, required: true };
const MAX_LENGTH = 2;

export interface SurveyDataType {
  user: string
  survey: {
    questions: QuestionType[]
    order: OrderTypeDB[]
  }
  published: boolean
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
  options: [{
    id: { ...RequiredString },
    value: { type: String },
  }],
});

function validateLength<AnyArray>(value: AnyArray[]) {
  console.log('validating lelngth', value);
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
}, { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } });

surveySchema.virtual('title').get(function getit(this: SurveyDataType) {
  const firstTitle = this.survey.order.find((question: { type: string; }) => question.type === 'title');
  if (!firstTitle) { return 'untitled'; }
  return firstTitle ? this.survey.questions.find(((q) => firstTitle.questionId === q.questionId))?.title : 'undefined';
});

export default model<SurveyDataType>('surveys', surveySchema);
