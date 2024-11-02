import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import { UserServiceAbstract } from '../abstract/user-service.abstract';
import { UserRepositoryAbstract } from '../abstract/user-repository.abstract';
import { User } from '../entities/user.entity';
import { CreateUserDTO } from '../dto/create-user.dto';
import { EmailServiceAbstract } from 'src/email/abstract/email-service.abstract';
import { SendPasswordRecoveryDTO } from 'src/email/dto/send-password-recovery.dto';
import { UserMapper } from '../mapper/user.mapper';
import { UserDTO } from '../dto/user.dto';
import { UpdateUserDTO } from '../dto/update-user.dto';
import { UserOverviewDTO } from '../dto/user-overview.dto';
import { UpdatePasswordDTO } from '../dto/update-password.dto';
import { UserPayloadDTO } from 'src/auth/dto/user-payload.dto';
import { UserRole } from 'src/common/global.enums';
import { ResetPasswordDTO } from '../dto/reset-password.dto';

@Injectable()
export class UserService implements UserServiceAbstract {
  constructor(
    private readonly userRepository: UserRepositoryAbstract,
    private readonly emailService: EmailServiceAbstract,
  ) {}

  public async getEntityById(id: string): Promise<User> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getAllUsersByCompanyId(companyId: string): Promise<UserOverviewDTO[]> {
    const users = await this.userRepository.getAllUserByCompanyId(companyId);
    return users.map(UserMapper.toOverviewDTO);
  }
  async findOneByEmail(email: string): Promise<User | null> {
    const user = await this.userRepository.findOneByEmail(email);
    return user;
  }

  async getById(id: string): Promise<UserDTO> {
    const user = await this.getEntityById(id);
    return UserMapper.toDTO(user);
  }

  async createUser(
    userData: CreateUserDTO,
    companyId: string,
  ): Promise<UserDTO> {
    const userExists = await this.findOneByEmail(userData.email);
    if (userExists) {
      throw new ConflictException('User already exists with this email');
    }

    const newUser = UserMapper.toEntity(userData);
    newUser.company_id = companyId; //Already validated in the guard that the companyId is valid for the user
    const createdUser = await this.userRepository.save(newUser);
    return UserMapper.toDTO(createdUser);
  }

  async updateUser(updateData: UpdateUserDTO): Promise<UserDTO> {
    const user = await this.getEntityById(updateData.id);
    const updatedUser = UserMapper.updateEntity(updateData, user);

    this.userRepository.save(updatedUser);
    return await this.getById(updateData.id);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const user = await this.userRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    const resetToken = randomBytes(32).toString('hex');
    const expireAt = addMinutes(new Date(), 60);

    user.reset_token = resetToken;
    user.reset_token_expiry = expireAt;
    await this.userRepository.save(user);

    await this.sendResetPasswordEmail(user.email, resetToken);
  }

  async updatePassword(
    updatePasswordDTO: UpdatePasswordDTO,
    user: UserPayloadDTO,
  ): Promise<void> {
    const userToUpdate = await this.getEntityById(updatePasswordDTO.userId);

    this.throwIfUserLacksUpdatePermission(user, userToUpdate);

    userToUpdate.password = updatePasswordDTO.newPassword;
    await this.userRepository.save(userToUpdate);
  }

  async resetPassword(resetDTO: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findOneByResetToken(resetDTO.token);
    if (!user) {
      throw new Error('Token is invalid or has expired');
    }

    user.password = resetDTO.newPassword;
    user.reset_token = null;
    user.reset_token_expiry = null;
    await this.userRepository.save(user);
  }

  private async sendResetPasswordEmail(
    email: string,
    token: string,
  ): Promise<void> {
    const sendPasswordRecoveryDTO = new SendPasswordRecoveryDTO();
    sendPasswordRecoveryDTO.email = email;
    sendPasswordRecoveryDTO.token = token;
    await this.emailService.sendPasswordRecovery(sendPasswordRecoveryDTO);
  }

  private throwIfUserLacksUpdatePermission(
    requestingUser: UserPayloadDTO,
    userToUpdate: User,
  ): void {
    const hasSufficientPermission =
      requestingUser.role === UserRole.SUPER_ADMIN ||
      (requestingUser.role === UserRole.CUSTOMER_ADMIN &&
        requestingUser.companyId === userToUpdate.company_id) ||
      requestingUser.sub === userToUpdate.id;

    if (!hasSufficientPermission) {
      throw new ForbiddenException(
        'You do not have permission to update this user',
      );
    }
  }
}
