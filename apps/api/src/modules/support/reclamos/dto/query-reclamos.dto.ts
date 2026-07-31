import { IsEnum, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoReclamo, PrioridadReclamo } from '@prisma/client';

export class QueryReclamosDto {
  @ApiPropertyOptional({ enum: EstadoReclamo })
  @IsOptional()
  @IsEnum(EstadoReclamo)
  estado?: EstadoReclamo;

  @ApiPropertyOptional({ enum: PrioridadReclamo })
  @IsOptional()
  @IsEnum(PrioridadReclamo)
  prioridad?: PrioridadReclamo;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  asignadoA?: string;

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
