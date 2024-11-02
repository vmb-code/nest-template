import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/common/global.enums';

export class UserDTO {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
  })
  id: string = '';

  @ApiProperty({ description: 'Whether the user is active or inactive' })
  isActive: boolean = false;

  @ApiProperty({ description: 'Role of the user', enum: UserRole })
  role: UserRole = UserRole.NORMAL;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  email: string = '';

  @ApiProperty({
    description: 'First name of the user',
    example: 'John',
  })
  firstName: string = '';

  @ApiProperty({
    description: 'Last name of the user',
    example: 'Doe',
  })
  lastName: string = '';

  @ApiProperty({
    description: 'Phone number of the user',
    example: '+46 123 456 789',
  })
  phoneNumber: string = '';
}
