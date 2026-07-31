import { IsBooleanString, IsIn, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

const CAMPOS_ORDENABLES = ['nombre', 'createdAt'] as const;

export class QueryClientesDto {
  @ApiPropertyOptional({ description: 'Búsqueda parcial por nombre' })
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional({ description: 'Búsqueda parcial por teléfono' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ description: 'true/false' })
  @IsOptional()
  @IsBooleanString()
  esFrecuente?: string;

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
