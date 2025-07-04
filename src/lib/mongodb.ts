import { MongoClient, MongoClientOptions } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}
console.log('Using MongoDB URI:', process.env.MONGODB_URI);

export const options: MongoClientOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority'
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  }

  if (!globalWithMongo._mongoClientPromise) {
    console.log('Creating new MongoDB client (development)');
    client = new MongoClient(process.env.MONGODB_URI!, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .then((client: MongoClient) => {
        console.log('Connected to MongoDB (development)');
        return client;
      })
      .catch((error: Error) => {
        console.error('MongoDB connection error (development):', error);
        throw error;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  console.log('Creating new MongoDB client (production)');
  client = new MongoClient(process.env.MONGODB_URI!, options);
  clientPromise = client.connect()
    .then((client: MongoClient) => {
      console.log('Connected to MongoDB (production)');
      return client;
    })
    .catch((error: Error) => {
      console.error('MongoDB connection error (production):', error);
      throw error;
    });
}

export default clientPromise;
