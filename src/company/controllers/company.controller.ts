import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { CompanyServiceAbstract } from '../abstract/company-service.abstract';
import { CreateCompanyDTO } from '../dto/create-company.dto';
import { UpdateCompanyDTO } from '../dto/update-company.dto';
import { CompanyDTO } from '../dto/company.dto';
import { CompanyOverviewDTO } from '../dto/company-overview.dto';
import { ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/consts/auth.consts';
import {
  CreateCompanySwagger,
  GetCompanyByIdSwagger,
  GetAllCompaniesSwagger,
  UpdateCompanySwagger,
} from '../decorators/company-swagger.decorators';

@ApiTags('company')
@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyServiceAbstract) {}

  @Post()
  @CreateCompanySwagger()
  @Public()
  async createCompany(
    @Body() companyData: CreateCompanyDTO,
  ): Promise<CompanyDTO> {
    const company = await this.companyService.createCompany(companyData);
    return company;
  }

  @Get(':id')
  @GetCompanyByIdSwagger()
  @Public()
  async getCompanyById(@Param('id') id: string): Promise<CompanyDTO> {
    const company = await this.companyService.getById(id);
    return company;
  }

  @Get()
  @GetAllCompaniesSwagger()
  @Public()
  async getAllCompanies(): Promise<CompanyOverviewDTO[]> {
    return this.companyService.getAllCompanies();
  }

  @Put(':id')
  @UpdateCompanySwagger()
  @Public()
  async updateCompany(
    @Param('id') id: string,
    @Body() updateData: UpdateCompanyDTO,
  ): Promise<CompanyDTO> {
    const company = await this.companyService.updateCompany(id, updateData);
    return company;
  }
}
