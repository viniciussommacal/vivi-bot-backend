import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'leads_database';

let dbInstance: Db;
let clientInstance: MongoClient;

export async function getDb(): Promise<Db> {
  try {
    if (dbInstance) {
      return dbInstance;
    }

    clientInstance = new MongoClient(uri);
    await clientInstance.connect();
    console.log('MongoDB connected');

    dbInstance = clientInstance.db(dbName);
    return dbInstance;
  } catch (error) {
    console.error('Error connecting to database', error);

    throw error;
  }
}
