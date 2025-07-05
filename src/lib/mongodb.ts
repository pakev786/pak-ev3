import { MongoClient, MongoClientOptions } from 'mongodb';

const options: MongoClientOptions = {
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 1,
  retryWrites: true,
  w: 'majority'
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient() {
  if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
  }
  if (client) return client;
  if (clientPromise) return clientPromise;
  client = new MongoClient(process.env.MONGODB_URI, options);
  clientPromise = client.connect();
  return clientPromise;
}
