import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Carlos Ruiz' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'carlos@belaroma.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'ContraseñaTemporal123!' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: ['ADMIN', 'AGENTE'], example: 'AGENTE' })
  @IsIn(['ADMIN', 'AGENTE'])
  rol: 'ADMIN' | 'AGENTE';
}
