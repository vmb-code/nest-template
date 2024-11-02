import { ApiProperty } from '@nestjs/swagger';

export class CompanyOverviewDTO {
  @ApiProperty({
    description: 'Company ID',
    example: 'uuid-string',
  })
  id!: string;

  @ApiProperty({
    description: 'Official name of the company',
    example: 'Example Corp',
  })
  companyName!: string;

  @ApiProperty({
    description: 'City where the company is registered',
    example: 'Stockholm',
  })
  city!: string;

  @ApiProperty({
    description: 'Contact email for the company',
    example: 'contact@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Phone number for the company',
    example: '+46 123 456 789',
  })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Whether the company is active or inactive',
    example: 'Yes',
  })
  isActive!: string;
}
