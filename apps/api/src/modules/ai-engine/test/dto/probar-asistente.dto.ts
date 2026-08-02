import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MensajePruebaDto {
  @ApiProperty({ enum: ['CLIENTE', 'IA'] })
  @IsIn(['CLIENTE', 'IA'])
  emisor: 'CLIENTE' | 'IA';

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contenido: string;
}

export class ProbarAsistenteDto {
  @ApiProperty({ example: '¿Tienen envíos a domicilio?' })
  @IsString()
  @IsNotEmpty()
  mensaje: string;

  @ApiPropertyOptional({
    type: [MensajePruebaDto],
    description: 'Historial previo del chat de prueba (no persiste en el backend)',
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MensajePruebaDto)
  historial?: MensajePruebaDto[];
}
