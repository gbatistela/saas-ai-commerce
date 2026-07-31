import { IsEnum, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CanalOrigen, EstadoConversacion } from '@prisma/client';

export class QueryConversacionesDto {
  @ApiPropertyOptional({ enum: EstadoConversacion })
  @IsOptional()
  @IsEnum(EstadoConversacion)
  estado?: EstadoConversacion;

  @ApiPropertyOptional({ enum: CanalOrigen })
  @IsOptional()
  @IsEnum(CanalOrigen)
  canal?: CanalOrigen;

  @ApiPropertyOptional({ description: 'ID del usuario asignado' })
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
