import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EstadoConversacion } from '@prisma/client';

export class ActualizarEstadoDto {
  @ApiProperty({ enum: EstadoConversacion })
  @IsEnum(EstadoConversacion)
  estado: EstadoConversacion;
}
