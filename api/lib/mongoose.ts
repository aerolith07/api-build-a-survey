import { connect } from 'mongoose';
import env from './config';

const uri = env.MONGO_URI;
let isConnected: number;

const connectMongo = async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return connect(uri, {
    useCreateIndex: true,
    useFindAndModify: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    });
};

export default connectMongo;
