import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CompanyIdParam {
  @IsUUID()
  @ApiProperty({
    description: 'Company ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  companyId!: string;
}
