import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVarianteDto {
  @ApiPropertyOptional({ example: 'Negro' })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional({ example: 'M' })
  @IsOptional()
  @IsString()
  talle?: string;

  @ApiProperty({ example: 'CAMP-CUERO-NEG-M' })
  @IsString()
  @IsNotEmpty()
  skuVariante: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioAdicional?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  imagenUrl?: string;
}
