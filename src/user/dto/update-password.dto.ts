import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class UpdatePasswordDTO {
  @ApiProperty({ description: 'UUID of the user' })
  @IsUUID(4)
  userId!: string;

  @ApiProperty({ description: 'New password for the user' })
  @IsString()
  @IsNotEmpty()
  @Length(8)
  newPassword!: string;
}
