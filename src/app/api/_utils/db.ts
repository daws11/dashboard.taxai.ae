import mongoose from 'mongoose';

declare global {
  var _mongoose: Promise<typeof mongoose> | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taxai';

if (!global._mongoose) {
  global._mongoose = mongoose.connect(MONGODB_URI);
}

export default global._mongoose; 