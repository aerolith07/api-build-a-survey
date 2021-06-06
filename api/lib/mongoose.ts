import { connect } from 'mongoose';
import env from './config';

const uri = env.MONGO_URI;
let isConnected: number;

export default async () => {
  if (isConnected) {
    console.log('=> using existing database connection');
    return Promise.resolve();
  }

  console.log('=> using new database connection');
  return connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((db) => {
      isConnected = db.connections[0].readyState;
    });
};
