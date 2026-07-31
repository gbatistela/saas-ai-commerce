import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRespuestaRapidaDto {
  @ApiProperty({ example: '/envio' })
  @IsString()
  @IsNotEmpty()
  atajo: string;

  @ApiProperty({ example: 'Los envíos demoran entre 3 y 5 días hábiles.' })
  @IsString()
  @IsNotEmpty()
  contenido: string;
}
