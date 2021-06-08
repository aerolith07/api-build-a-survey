import { model, Schema, Types } from 'mongoose';
import surveyModel from './surveyModel';

const RequiredString = { type: String, required: true };

export type AnswerType = {
  id: string,
  title: string,
  value: {id: string, value?: string}[]
}

export type AnswerSchemaType = {
  surveyId: string
  answer: AnswerType[]
}

const answerSchema = new Schema<AnswerSchemaType>({
  surveyId: { type: Types.ObjectId, ref: surveyModel, required: true },
  answer: [{
    id: { ...RequiredString },
    title: { ...RequiredString },
    value: [{
      id: { ...RequiredString },
      value: { type: String },
    }],
  }],
});

export default model<AnswerSchemaType>('answers', answerSchema);
