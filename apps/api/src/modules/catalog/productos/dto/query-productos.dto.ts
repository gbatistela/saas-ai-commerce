import { IsIn, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CAMPOS_ORDENABLES = ['nombre', 'precio', 'createdAt'] as const;

export class QueryProductosDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  marca?: string;

  @ApiPropertyOptional({ description: 'Búsqueda por texto en nombre/SKU' })
  @IsOptional()
  @IsString()
  texto?: string;

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'] })
  @IsOptional()
  @IsIn(['ACTIVO', 'INACTIVO', 'SUSPENDIDO'])
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';

  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ enum: CAMPOS_ORDENABLES, default: 'createdAt' })
  @IsOptional()
  @IsIn(CAMPOS_ORDENABLES)
  sort?: (typeof CAMPOS_ORDENABLES)[number] = 'createdAt';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
