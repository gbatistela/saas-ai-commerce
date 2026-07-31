import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductoDto {
  @ApiProperty({ example: 'Campera de cuero negra' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: 'CAMP-CUERO-NEG' })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: 45000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precio: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  costo?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoriaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  marcaId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  peso?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  codigoBarras?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoSlug?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  seoMeta?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  destacado?: boolean;
}
