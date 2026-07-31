import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoReclamo, PrioridadReclamo } from '@prisma/client';

export class UpdateReclamoDto {
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
  asignadoAId?: string;
}
