import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyRepositoryAbstract } from '../abstract/company-repository.abstract';
import { Company } from '../entities/company.entity';

@Injectable()
export class CompanyRepository extends CompanyRepositoryAbstract {
  constructor(
    @InjectRepository(Company)
    private readonly repository: Repository<Company>,
  ) {
    super();
  }

  async getById(id: string): Promise<Company | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['users'],
    });
  }

  async getAll(): Promise<Company[]> {
    return this.repository.find({ relations: ['users'] });
  }

  create(companyData: Partial<Company>): Company {
    return this.repository.create(companyData);
  }

  async save(company: Company): Promise<Company> {
    return this.repository.save(company);
  }

  async findByCompanyName(company_name: string): Promise<Company | null> {
    return this.repository.findOne({ where: { company_name } });
  }

  async findByOrganizationNumber(
    organization_number: string,
  ): Promise<Company | null> {
    return this.repository.findOne({ where: { organization_number } });
  }

  async inactivate(company: Company): Promise<Company> {
    company.active = false; // Set active to false
    return this.repository.save(company); // Save the inactivated company
  }
}
