import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoMensaje } from '@prisma/client';

export class CreateArchivoReclamoDto {
  @ApiProperty({
    description:
      'URL del archivo ya subido a MinIO/S3 (igual que en Catalog, este endpoint solo registra el archivo)',
  })
  @IsUrl({ require_tld: false })
  url: string;

  @ApiProperty({ example: 'image/jpeg' })
  @IsString()
  @IsNotEmpty()
  tipoMime: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  tamanoBytes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bucket?: string;

  @ApiProperty({ enum: TipoMensaje })
  @IsEnum(TipoMensaje)
  tipo: TipoMensaje;
}
