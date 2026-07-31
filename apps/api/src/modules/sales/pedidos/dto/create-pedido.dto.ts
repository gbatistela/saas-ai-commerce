import { IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePedidoDto {
  @ApiProperty({ description: 'Carrito activo desde el cual se genera el pedido' })
  @IsUUID()
  carritoId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  direccionId?: string;
}
