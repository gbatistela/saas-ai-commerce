import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'giuliana@belaroma.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ContraseñaSegura123!' })
  @IsString()
  @MinLength(1)
  password: string;
}
