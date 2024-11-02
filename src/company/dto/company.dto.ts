import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserDTO } from 'src/user/dto/user.dto';

export class CompanyDTO {
  @ApiProperty({
    description: 'Company ID',
    example: 'uuid-string',
  })
  id!: string;

  @ApiProperty({
    description: 'Whether the company is active or not',
    example: true,
  })
  active!: boolean;

  @ApiProperty({
    description: 'Swedish organization number (10 or 12 digits)',
    example: '1234567890',
  })
  organizationNumber!: string;

  @ApiProperty({
    description: 'Official name of the company',
    example: 'Example Corp',
  })
  companyName!: string;

  @ApiPropertyOptional({
    description: 'VAT number (Momsregistreringsnummer)',
    example: 'SE1234567890',
  })
  vatNumber?: string | null;

  @ApiProperty({
    description: 'Registered company address',
    example: '123 Main St',
  })
  address!: string;

  @ApiProperty({
    description: 'City where the company is registered',
    example: 'Stockholm',
  })
  city!: string;

  @ApiProperty({
    description: 'Postal code for the company',
    example: '12345',
  })
  postalCode!: string;

  @ApiProperty({
    description: 'Country where the company is located',
    example: 'Sweden',
  })
  country!: string;

  @ApiProperty({
    description: 'Contact email for the company',
    example: 'contact@example.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Contact phone number for the company',
    example: '+46 123 456 789',
  })
  phoneNumber!: string;

  @ApiProperty({
    description: 'Number of employees in the company',
    example: 100,
  })
  numberOfEmployees!: number;

  @ApiPropertyOptional({
    description: 'Company website',
    example: 'https://www.example.com',
  })
  website?: string | null;

  @ApiPropertyOptional({
    description: 'CEO of the company',
    example: 'John Doe',
  })
  ceo?: string | null;

  @ApiPropertyOptional({
    description: 'Industry or sector of the company',
    example: 'Technology',
  })
  industry?: string | null;

  @ApiPropertyOptional({
    description: 'List of users associated with the company',
    type: [UserDTO],
  })
  users?: UserDTO[]; // The list of users tied to the company
}
