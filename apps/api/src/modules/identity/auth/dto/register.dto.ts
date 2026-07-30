import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Perfumería Bella Aroma' })
  @IsString()
  @IsNotEmpty()
  nombreEmpresa: string;

  @ApiProperty({ example: 'perfumeria', required: false })
  @IsString()
  @IsOptional()
  rubro?: string;

  @ApiProperty({ example: 'Giuliana Pérez' })
  @IsString()
  @IsNotEmpty()
  nombreUsuario: string;

  @ApiProperty({ example: 'giuliana@belaroma.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ContraseñaSegura123!' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}
