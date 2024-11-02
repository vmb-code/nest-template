import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { UserRepositoryAbstract } from '../abstract/user-repository.abstract';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository extends UserRepositoryAbstract {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {
    super();
  }

  async getAllUserByCompanyId(companyId: string): Promise<User[]> {
    return this.repository.find({
      where: { company_id: companyId },
    });
  }

  async getById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id }, relations: ['company'] });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  create(user: Partial<User>): User {
    return this.repository.create(user);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findOneByResetToken(token: string): Promise<User | null> {
    return this.repository.findOne({
      where: { reset_token: token, reset_token_expiry: MoreThan(new Date()) },
    });
  }
}
