import { IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryStorefrontProductosDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  categoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  marca?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  texto?: string;

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
}
