import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateClienteDto {
  @ApiProperty({
    example: '+5491122334455',
    description: 'Alta manual desde el panel (canalOrigen = MANUAL)',
  })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiPropertyOptional({ example: 'Juana Pérez' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;
}
