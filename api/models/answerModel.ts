import { model, Schema } from 'mongoose';

const RequiredString = { type: String, required: true };

export type AnswerType = {
  id: string,
  title: string,
  options: {id: string, value?: string}[]
}

export type AnswerSchemaType = {
  id: string
  answer: AnswerType[]
}

const answerSchema = new Schema<AnswerSchemaType>({
  answer: [{
    id: { ...RequiredString },
    title: { ...RequiredString },
    options: [{
      id: { ...RequiredString },
      value: { type: String },
    }],
  }],
});

export default model<AnswerSchemaType>('answers', answerSchema);
