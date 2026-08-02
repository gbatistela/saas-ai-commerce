import { IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { QueryRangoDto } from './query-rango.dto';

export class QueryTopProductosDto extends QueryRangoDto {
  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  limit?: number = 10;
}
