import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoMensaje } from '@prisma/client';

export class CreateMensajeDto {
  @ApiProperty({ example: 'Hola, ya reviso tu pedido y te aviso.' })
  @IsString()
  @IsNotEmpty()
  contenido: string;

  @ApiPropertyOptional({ enum: TipoMensaje, default: TipoMensaje.TEXTO })
  @IsOptional()
  @IsEnum(TipoMensaje)
  tipo?: TipoMensaje;
}
