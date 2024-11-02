import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  IsBoolean,
  Length,
  MaxLength,
  IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCompanyDTO {
  @ApiProperty({
    description: 'Company ID',
    example: '7245f95d-ebee-4f44-bb37-4b0a60daf8b4',
  })
  @IsUUID()
  id!: string;

  @ApiPropertyOptional({
    description: 'Whether the company is active or not',
    example: true,
  })
  @IsOptional()
  active!: boolean;

  @ApiPropertyOptional({
    description: 'Swedish organization number (10 or 12 digits)',
    example: '1234567890',
  })
  @IsString()
  @Length(10, 12)
  organizationNumber!: string;

  @ApiPropertyOptional({
    description: 'Official name of the company',
    example: 'Example Corp',
  })
  @IsString()
  @MaxLength(255)
  companyName!: string;

  @ApiPropertyOptional({
    description: 'VAT number (Momsregistreringsnummer)',
    example: 'SE1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  vatNumber!: string | null;

  @ApiPropertyOptional({
    description: 'Registered company address',
    example: '123 Main St',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address!: string | null;

  @ApiPropertyOptional({
    description: 'City where the company is registered',
    example: 'Stockholm',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city!: string | null;

  @ApiPropertyOptional({
    description: 'Postal code for the company',
    example: '12345',
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  postalCode!: string | null;

  @ApiPropertyOptional({
    description: 'Country where the company is located',
    example: 'Sweden',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country!: string | null;

  @ApiPropertyOptional({
    description: 'Contact email for the company',
    example: 'contact@example.com',
  })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email!: string | null;

  @ApiPropertyOptional({
    description: 'Contact phone number for the company',
    example: '+46 123 456 789',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phoneNumber!: string | null;

  @ApiPropertyOptional({
    description: 'Number of employees in the company',
    example: 100,
  })
  @IsOptional()
  @IsInt()
  numberOfEmployees!: number | null;

  @ApiPropertyOptional({
    description: 'Company website',
    example: 'https://www.example.com',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website!: string | null;

  @ApiPropertyOptional({
    description: 'CEO of the company',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ceo!: string | null;

  @ApiPropertyOptional({
    description: 'Industry or sector of the company',
    example: 'Technology',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry!: string | null;
}
