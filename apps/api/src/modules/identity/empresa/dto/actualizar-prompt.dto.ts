import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActualizarPromptDto {
  @ApiProperty({
    example:
      'Sos un asesor comercial humano, nunca digas que sos una IA. Mantené un tono cercano y profesional.',
  })
  @IsString()
  @IsNotEmpty()
  contenido: string;
}
