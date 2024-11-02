import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Length,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/common/global.enums';

export class CreateUserDTO {
  @ApiProperty({ description: 'Email address of the new user' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ description: 'Password of the new user' })
  @IsString()
  @IsNotEmpty()
  @Length(8)
  password!: string;

  @ApiProperty({ description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName!: string;

  @ApiProperty({ description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName!: string;

  @ApiProperty({ description: 'Phone number of the user' })
  @IsString()
  @Length(10, 20) //TODO: Validation for phone number format
  phoneNumber!: string;

  @ApiProperty({ description: 'Role of the new user', enum: UserRole })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ description: 'Whether the user is active or inactive' })
  @IsBoolean()
  isActive!: boolean;
}
