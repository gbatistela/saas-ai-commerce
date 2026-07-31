import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PrioridadReclamo } from '@prisma/client';

export class CreateReclamoDto {
  @ApiProperty()
  @IsUUID()
  clienteId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  pedidoId?: string;

  @ApiProperty({ example: 'producto_defectuoso' })
  @IsString()
  @IsNotEmpty()
  tipo: string;

  @ApiProperty({ example: 'La campera llegó con la cremallera rota' })
  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @ApiPropertyOptional({ enum: PrioridadReclamo, default: PrioridadReclamo.MEDIA })
  @IsOptional()
  @IsEnum(PrioridadReclamo)
  prioridad?: PrioridadReclamo;
}
