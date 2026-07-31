import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateStockDto {
  @ApiProperty({ example: 12, description: 'Cantidad final de stock (no un delta)' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidad: number;

  @ApiPropertyOptional({ default: 'principal' })
  @IsOptional()
  @IsString()
  deposito?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockMinimo?: number;
}
