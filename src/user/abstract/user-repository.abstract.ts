import { User } from '../entities/user.entity';

export abstract class UserRepositoryAbstract {
  abstract getById(id: string): Promise<User | null>;
  abstract getAllUserByCompanyId(companyId: string): Promise<User[]>;
  abstract findOneByEmail(email: string): Promise<User | null>;
  abstract create(user: Partial<User>): User;
  abstract save(user: User): Promise<User>;
  abstract findOneByResetToken(token: string): Promise<User | null>;
}
