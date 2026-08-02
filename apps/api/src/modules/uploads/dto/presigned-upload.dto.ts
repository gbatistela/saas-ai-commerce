import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const CARPETAS_PERMITIDAS = ['productos', 'reclamos'] as const;

const CONTENT_TYPES_PERMITIDOS = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'audio/mpeg',
  'audio/ogg',
  'application/pdf',
] as const;

export class PresignedUploadDto {
  @ApiProperty({ enum: CARPETAS_PERMITIDAS })
  @IsIn(CARPETAS_PERMITIDAS)
  carpeta: (typeof CARPETAS_PERMITIDAS)[number];

  @ApiProperty({ example: 'campera-negra.jpg' })
  @IsString()
  @IsNotEmpty()
  nombreArchivo: string;

  @ApiProperty({ enum: CONTENT_TYPES_PERMITIDOS })
  @IsIn(CONTENT_TYPES_PERMITIDOS)
  contentType: (typeof CONTENT_TYPES_PERMITIDOS)[number];
}
