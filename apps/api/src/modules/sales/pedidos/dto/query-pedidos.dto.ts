import { IsDateString, IsEnum, IsOptional, IsUUID, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EstadoPedidoEnum } from '@prisma/client';

export class QueryPedidosDto {
  @ApiPropertyOptional({ enum: EstadoPedidoEnum, description: 'Filtra por el estado ACTUAL del pedido' })
  @IsOptional()
  @IsEnum(EstadoPedidoEnum)
  estado?: EstadoPedidoEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  cliente?: string;

  @ApiPropertyOptional({ description: 'ISO date, filtra pedidos creados desde esta fecha' })
  @IsOptional()
  @IsDateString()
  fechaDesde?: string;

  @ApiPropertyOptional({ description: 'ISO date, filtra pedidos creados hasta esta fecha' })
  @IsOptional()
  @IsDateString()
  fechaHasta?: string;

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
