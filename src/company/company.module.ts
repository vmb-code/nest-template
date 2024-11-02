import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyService } from './services/company.service';
import { CompanyController } from './controllers/company.controller';
import { Company } from './entities/company.entity';
import { CompanyServiceAbstract } from './abstract/company-service.abstract';
import { CompanyRepositoryAbstract } from './abstract/company-repository.abstract';
import { CompanyRepository } from './repositories/company.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Company]), UserModule],
  providers: [
    { provide: CompanyRepositoryAbstract, useClass: CompanyRepository },
    { provide: CompanyServiceAbstract, useClass: CompanyService },
  ],
  controllers: [CompanyController],
  exports: [CompanyServiceAbstract],
})
export class CompanyModule { }
