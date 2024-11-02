import { Company } from '../entities/company.entity';

export abstract class CompanyRepositoryAbstract {
  abstract getById(id: string): Promise<Company | null>;

  abstract getAll(): Promise<Company[]>;
  abstract create(companyData: Partial<Company>): Company;

  abstract save(company: Company): Promise<Company>;

  abstract findByCompanyName(companyName: string): Promise<Company | null>;

  abstract findByOrganizationNumber(
    organizationNumber: string,
  ): Promise<Company | null>;

  abstract inactivate(company: Company): Promise<Company>;
}
