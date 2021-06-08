import { model, Schema, Types } from 'mongoose';
import { OrderTypeDB, QuestionType } from '../lib/transformers/surveyTypes';
import userModel from './userModel';

const RequiredString = { type: String, required: true };
const MAX_LENGTH = 100;

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
  return value.length > MAX_LENGTH;
}

const userSchema = new Schema<SurveyDataType>({
  user: {
    type: Types.ObjectId, ref: userModel, required: true,
  },
  survey: {
    questions: { type: [QuestionSchema], validator: validateLength },
    order: { type: [OrderSchema], validator: validateLength },
  },
  published: { type: Boolean, required: true, default: false },
}, { timestamps: true });

export default model<SurveyDataType>('surveys', userSchema);
