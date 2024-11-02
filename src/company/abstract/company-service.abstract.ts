import { CompanyOverviewDTO } from '../dto/company-overview.dto';
import { CompanyDTO } from '../dto/company.dto';
import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';

export abstract class CompanyServiceAbstract {
  public abstract createCompany(
    companyData: CreateCompanyDTO,
  ): Promise<CompanyDTO>;

  public abstract getById(id: string): Promise<CompanyDTO>;

  public abstract getAllCompanies(): Promise<CompanyOverviewDTO[]>;

  public abstract updateCompany(
    id: string,
    updateData: UpdateCompanyDTO,
  ): Promise<CompanyDTO>;
}
