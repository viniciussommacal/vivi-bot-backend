import { Lead } from '../../models/Lead';

export interface ILeadRepository {
  create(lead: Lead): Promise<Lead>;
  findAll(): Promise<Lead[]>;
  findById(id: string): Promise<Lead | null>;
  update(id: string, lead: Partial<Lead>): Promise<void>;
  delete(id: string): Promise<void>;
}
