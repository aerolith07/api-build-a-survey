import dotenv from 'dotenv';

dotenv.config();

const env = {
  MONGO_URI: process.env.MONGO_URI || '',
  SECRET: process.env.SECRET,
  BUILD_STAGE: process.env.BUILD_STAGE,
};

export default env;
