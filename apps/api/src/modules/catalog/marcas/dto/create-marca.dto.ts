import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMarcaDto {
  @ApiProperty({ example: 'Levi\'s' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;
}
