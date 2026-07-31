import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoRelacionProducto } from '@prisma/client';

export class CreateRelacionadoDto {
  @ApiProperty({ description: 'ID del producto relacionado' })
  @IsUUID()
  relacionadoId: string;

  @ApiProperty({ enum: TipoRelacionProducto })
  @IsEnum(TipoRelacionProducto)
  tipo: TipoRelacionProducto;
}
