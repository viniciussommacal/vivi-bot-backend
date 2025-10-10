import { LeadRepository } from '../repositories/leadRepository';

export default async function userRegisterTools(args: string) {
  const params: {
    name: string;
    phone: string;
    email: string;
  } = JSON.parse(args);
  const leadRepo = new LeadRepository();

  const lead = await leadRepo.create({
    nome: params.name,
    telefone: params.phone,
    email: params.email,
  });

  console.log(
    `\x1b[32mLead ${params.name} registrado com sucesso! ID: ${lead._id}\x1b[0m`,
  );

  return lead;
}
