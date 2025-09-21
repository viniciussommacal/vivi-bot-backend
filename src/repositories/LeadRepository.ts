import { ILeadRepository } from './contracts/LeadRepository';
import { Lead } from '../models/Lead';
import { getDb } from '../database/MongoClient';
import { ObjectId, Document, WithId, Db } from 'mongodb';

export class LeadRepository implements ILeadRepository {
  private collectionName = 'leads';
  private db!: Db;

  constructor() {
    this.init();
  }

  private async init() {
    this.db = await getDb();
  }

  private async getCollection() {
    if (!this.db) {
      await this.init();
    }

    return this.db.collection(this.collectionName);
  }

  async create(lead: Lead): Promise<Lead> {
    const { _id, ...dbLead } = lead;

    const collection = await this.getCollection();
    const result = await collection.insertOne(dbLead);

    return {
      ...lead,
      _id: result.insertedId.toHexString(),
    };
  }

  async findAll(): Promise<Lead[]> {
    const collection = await this.getCollection();
    const docs: WithId<Document>[] = await collection.find().toArray();

    return docs.map(doc => ({
      _id: doc._id.toHexString(),
      nome: doc.nome,
      telefone: doc.telefone,
      email: doc.email,
    }));
  }

  async findById(id: string): Promise<Lead | null> {
    const collection = await this.getCollection();
    const doc = await collection.findOne({ _id: new ObjectId(id) });

    if (!doc) return null;

    return {
      _id: doc._id.toHexString(),
      nome: doc.nome,
      telefone: doc.telefone,
      email: doc.email,
    };
  }

  async update(id: string, lead: Partial<Lead>): Promise<void> {
    const collection = await this.getCollection();
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: lead });
  }

  async delete(id: string): Promise<void> {
    const collection = await this.getCollection();
    await collection.deleteOne({ _id: new ObjectId(id) });
  }
}
