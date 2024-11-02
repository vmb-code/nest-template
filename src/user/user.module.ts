import { Module } from '@nestjs/common';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserServiceAbstract } from './abstract/user-service.abstract';
import { UserRepositoryAbstract } from './abstract/user-repository.abstract';
import { UserRepository } from './repositories/user.repository';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), EmailModule],
  providers: [
    { provide: UserRepositoryAbstract, useClass: UserRepository },
    { provide: UserServiceAbstract, useClass: UserService },
  ],
  controllers: [UserController],
  exports: [UserServiceAbstract],
})
export class UserModule {}
