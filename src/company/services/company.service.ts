import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CompanyServiceAbstract } from '../abstract/company-service.abstract';
import { CompanyOverviewDTO } from '../dto/company-overview.dto';
import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { CompanyRepositoryAbstract } from '../abstract/company-repository.abstract';
import { CompanyMapper } from '../mappers/company.mapper';
import { UserServiceAbstract } from 'src/user/abstract/user-service.abstract';
import { CompanyDTO } from '../dto/company.dto';

@Injectable()
export class CompanyService implements CompanyServiceAbstract {
  constructor(
    private readonly companyRepository: CompanyRepositoryAbstract,
    private readonly userService: UserServiceAbstract,
  ) {}

  async createCompany(companyData: CreateCompanyDTO): Promise<CompanyDTO> {
    // Check for existing company with the same name or organization number
    await this.throwIfCompanyExists(
      companyData.companyName,
      companyData.organizationNumber,
    );

    // Create the company if no conflicts were found
    const company = CompanyMapper.toEntity(companyData);
    const createdCompany = await this.companyRepository.save(company);
    const dto = CompanyMapper.toDTO(createdCompany);

    return dto;
  }

  async getById(id: string): Promise<CompanyDTO> {
    const company = await this.companyRepository.getById(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    const dto = CompanyMapper.toDTO(company);

    return dto;
  }

  async getAllCompanies(): Promise<CompanyOverviewDTO[]> {
    const companies = await this.companyRepository.getAll();
    return companies.map(CompanyMapper.toOverviewDTO);
  }

  async updateCompany(
    id: string,
    updateData: UpdateCompanyDTO,
  ): Promise<CompanyDTO> {
    const company = await this.companyRepository.getById(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    // Check for existing company with the same name or organization number, excluding the current company
    await this.throwIfCompanyExists(
      updateData.companyName,
      updateData.organizationNumber,
      id,
    );

    // Update the company if no conflicts were found
    const updatedCompany = CompanyMapper.toEntity(updateData, company);

    this.companyRepository.save(updatedCompany);
    return await this.getById(id);
  }

  private async throwIfCompanyExists(
    companyName: string,
    organizationNumber: string,
    excludeId?: string, // Optional parameter for excluding the current company in update
  ): Promise<void> {
    // Check if a company with the same name already exists
    const existingCompanyByName =
      await this.companyRepository.findByCompanyName(companyName);
    if (existingCompanyByName && existingCompanyByName.id !== excludeId) {
      throw new ConflictException(
        `A company with the name "${companyName}" already exists.`,
      );
    }

    // Check if a company with the same organization number already exists
    const existingCompanyByOrgNumber =
      await this.companyRepository.findByOrganizationNumber(organizationNumber);
    if (
      existingCompanyByOrgNumber &&
      existingCompanyByOrgNumber.id !== excludeId
    ) {
      throw new ConflictException(
        `A company with the organization number "${organizationNumber}" already exists.`,
      );
    }
  }
}
