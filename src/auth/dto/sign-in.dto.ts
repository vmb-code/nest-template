import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class SignInDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username of the user' })
  email!: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password of the user' })
  password!: string;
}
