import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  @ApiProperty({ description: 'New password for the user' })
  @IsNotEmpty()
  @IsString()
  // Uncomment the following when you want to activate password strength validation
  // @Matches(
  //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  //   {
  //     message: 'Password too weak',
  //   },
  // )
  newPassword!: string;

  @ApiProperty({ description: 'Token for password reset verification' })
  @IsNotEmpty()
  @IsString()
  token!: string;
}
