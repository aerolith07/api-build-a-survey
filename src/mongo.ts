import {MongoClient} from 'mongodb'
import env from './config';
const uri = env.MONGO_URI

let cached: any

async function connectToDB() {
  
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  
  if (!cached) {
    cached = MongoClient.connect(uri, options, (err, res) => {
      if (err) { throw err }
      console.log('connected to database');
      return res
    })
  }

  const client = await cached
  return client
}

export default connectToDB
