import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestPasswordResetDTO {
  @ApiProperty({
    description: 'Email address of the user requesting the password reset',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
}
