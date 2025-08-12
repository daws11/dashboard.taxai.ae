import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxai';
const options = {};

let client;
// let clientPromise: Promise<MongoClient>;

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}
const clientPromise = global._mongoClientPromise;

export default clientPromise;

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
} 