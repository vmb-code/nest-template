import { ApiProperty } from '@nestjs/swagger';

export class UserOverviewDTO {
  @ApiProperty({
    description: 'User ID',
    example: 'uuid-string',
  })
  id!: string;

  @ApiProperty({
    description: 'The email for the user account',
    example: 'user@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Full name of the user',
    example: 'John Doe',
  })
  fullName!: string;

  @ApiProperty({
    description: 'Phone number for the user',
    example: '+46 123 456 789',
  })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Whether the user is active or inactive',
    example: 'Yes',
  })
  isActive!: 'Yes' | 'No';

  @ApiProperty({
    description: 'Role label for the user',
    example: 'Admin',
  })
  roleLabel!: string;
}
