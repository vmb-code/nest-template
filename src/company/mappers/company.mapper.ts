import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { Company } from '../entities/company.entity';
import { UserMapper } from 'src/user/mapper/user.mapper';
import { CompanyDTO } from '../dto/company.dto';
import { CompanyOverviewDTO } from '../dto/company-overview.dto';

export class CompanyMapper {
  static toDTO(entity: Company): CompanyDTO {
    return {
      id: entity.id,
      active: entity.active,
      organizationNumber: entity.organization_number,
      companyName: entity.company_name,
      vatNumber: entity.vat_number,
      address: entity.address,
      city: entity.city,
      postalCode: entity.postal_code,
      country: entity.country,
      email: entity.email,
      phoneNumber: entity.phone_number,
      numberOfEmployees: entity.number_of_employees,
      website: entity.website,
      ceo: entity.ceo,
      industry: entity.industry,
      users: entity.users
        ? entity.users.map((user) => UserMapper.toDTO(user))
        : [], // Map the list of users
    };
  }

  static toOverviewDTO(entity: Company): CompanyOverviewDTO {
    return {
      id: entity.id,
      companyName: entity.company_name,
      city: entity.city,
      email: entity.email,
      phoneNumber: entity.phone_number,
      isActive: entity.active ? 'Yes' : 'No', // Return "Yes" if active, otherwise "No"
    };
  }

  // Convert DTO to Company entity (for saving/updating in the database)
  static toEntity(
    dto: CreateCompanyDTO | UpdateCompanyDTO,
    existingEntity?: Company,
  ): Company {
    const entity = existingEntity || new Company();

    if (dto instanceof CreateCompanyDTO) {
      entity.active = false; // Default value for creation
    } else {
      entity.active = dto.active ?? entity.active;
    }

    entity.organization_number =
      dto.organizationNumber ?? entity.organization_number;
    entity.company_name = dto.companyName ?? entity.company_name;
    entity.vat_number = dto.vatNumber ?? entity.vat_number;
    entity.address = dto.address ?? entity.address;
    entity.city = dto.city ?? entity.city;
    entity.postal_code = dto.postalCode ?? entity.postal_code;
    entity.country = dto.country ?? entity.country;
    entity.email = dto.email ?? entity.email;
    entity.phone_number = dto.phoneNumber ?? entity.phone_number;
    entity.number_of_employees =
      dto.numberOfEmployees ?? entity.number_of_employees;
    entity.website = dto.website ?? entity.website;
    entity.ceo = dto.ceo ?? entity.ceo;
    entity.industry = dto.industry ?? entity.industry;

    return entity;
  }
}
