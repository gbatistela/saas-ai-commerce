import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoPedidoEnum } from '@prisma/client';

export class ActualizarEstadoPedidoDto {
  @ApiProperty({ enum: EstadoPedidoEnum })
  @IsEnum(EstadoPedidoEnum)
  estado: EstadoPedidoEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comentario?: string;
}
