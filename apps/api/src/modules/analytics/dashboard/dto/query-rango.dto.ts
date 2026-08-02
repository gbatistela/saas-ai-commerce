import { IsDateString, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryRangoDto {
  @ApiPropertyOptional({ description: 'ISO date, default: hace 30 días' })
  @IsOptional()
  @IsDateString()
  desde?: string;

  @ApiPropertyOptional({ description: 'ISO date, default: ahora' })
  @IsOptional()
  @IsDateString()
  hasta?: string;
}
