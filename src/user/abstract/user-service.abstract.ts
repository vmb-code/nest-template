import { UserPayloadDTO } from 'src/auth/dto/user-payload.dto';
import { CreateUserDTO } from '../dto/create-user.dto';
import { UpdatePasswordDTO } from '../dto/update-password.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserOverviewDTO } from '../dto/user-overview.dto';
import { UserDTO } from '../dto/user.dto';
import { User } from '../entities/user.entity';
import { ResetPasswordDTO } from '../dto/reset-password.dto';

export abstract class UserServiceAbstract {
  public abstract getEntityById(id: string): Promise<User>;
  public abstract getAllUsersByCompanyId(
    companyId: string,
  ): Promise<UserOverviewDTO[]>;
  public abstract getById(string: string): Promise<UserDTO>;
  public abstract findOneByEmail(email: string): Promise<User | null>;
  public abstract createUser(
    userData: CreateUserDTO,
    companyId: string,
  ): Promise<UserDTO>;
  public abstract updateUser(userData: UpdateUserDTO): Promise<UserDTO>;
  public abstract requestPasswordReset(email: string): Promise<void>;
  public abstract resetPassword(resetDTO: ResetPasswordDTO): Promise<void>;
  public abstract updatePassword(
    updatePasswordDTO: UpdatePasswordDTO,
    user: UserPayloadDTO,
  ): Promise<void>;
}
