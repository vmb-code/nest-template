import { IsEmail, IsEnum, IsUUID } from 'class-validator';
import { UserRole } from 'src/common/global.enums';

export class UserPayloadDTO {
  @IsUUID()
  sub!: string;

  @IsEmail()
  email!: string;

  @IsUUID()
  companyId!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
