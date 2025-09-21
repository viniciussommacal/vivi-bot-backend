import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'my_database';

let dbInstance: Db;
let clientInstance: MongoClient;

export async function getDb(): Promise<Db> {
  if (dbInstance) {
    return dbInstance;
  }

  clientInstance = new MongoClient(uri);
  await clientInstance.connect();
  console.log('MongoDB connected');

  dbInstance = clientInstance.db(dbName);
  return dbInstance;
}
