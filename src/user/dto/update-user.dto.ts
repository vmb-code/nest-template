import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  Length,
  IsBoolean,
  IsEnum,
  IsUUID,
  IsNotEmpty,
} from 'class-validator';
import { UserRole } from 'src/common/global.enums';

export class UpdateUserDTO {
  @ApiProperty({ description: 'UUID of the user', example: 'uuid-string' })
  @IsUUID()
  @IsNotEmpty()
  id!: string;

  @ApiProperty({ description: 'Email address of the user' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  firstName?: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  lastName?: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  @IsOptional()
  @Length(10, 20)
  phoneNumber?: string;

  @ApiProperty({ description: 'Role of the user', enum: UserRole })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ description: 'Whether the user is active or inactive' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
