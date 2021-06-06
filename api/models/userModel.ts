import { model, Schema } from 'mongoose';

interface UserType {
  name: string,
  username: string,
  hash: string
}

const userSchema = new Schema<UserType>({
  name: { type: String },
  username: {
    type: String, required: true, lowercase: true, unique: true, trim: true,
  },
  hash: { type: String, required: true, select: false },
});

export default model<UserType>('users', userSchema);
