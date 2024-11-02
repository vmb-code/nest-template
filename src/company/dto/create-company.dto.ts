import {
  IsString,
  IsOptional,
  IsEmail,
  IsInt,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateCompanyDTO {
  @ApiProperty({
    description: 'Swedish organization number (10 or 12 digits)',
    example: '1234567890',
  })
  @IsString()
  @Length(10, 12)
  organizationNumber!: string;

  @ApiProperty({
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
  vatNumber?: string;

  @ApiProperty({
    description: 'Registered company address',
    example: '123 Main St',
  })
  @IsString()
  @MaxLength(255)
  address!: string;

  @ApiProperty({
    description: 'City where the company is registered',
    example: 'Stockholm',
  })
  @IsString()
  @MaxLength(100)
  city!: string;

  @ApiProperty({
    description: 'Postal code for the company',
    example: '12345',
  })
  @IsString()
  @MaxLength(10)
  postalCode!: string;

  @ApiProperty({
    description: 'Country where the company is located',
    example: 'Sweden',
  })
  @IsString()
  @MaxLength(100)
  country!: string;

  @ApiProperty({
    description: 'Contact email for the company',
    example: 'contact@example.com',
  })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({
    description: 'Contact phone number for the company',
    example: '+46 123 456 789',
  })
  @IsString()
  @MaxLength(20)
  phoneNumber!: string;

  @ApiProperty({
    description: 'Number of employees in the company',
    example: 100,
  })
  @IsInt()
  @Type(() => Number)
  numberOfEmployees!: number;

  @ApiPropertyOptional({
    description: 'Company website',
    example: 'https://www.example.com',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({
    description: 'CEO of the company',
    example: 'John Doe',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  ceo?: string;

  @ApiPropertyOptional({
    description: 'Industry or sector of the company',
    example: 'Technology',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  industry?: string;
}
