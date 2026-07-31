import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoArchivoProducto } from '@prisma/client';

export class CreateArchivoProductoDto {
  @ApiProperty({
    description:
      'URL del archivo ya subido a MinIO/S3 (la subida multipart se resuelve en la capa de infraestructura, este endpoint solo registra el archivo)',
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

  @ApiProperty({ enum: TipoArchivoProducto })
  @IsEnum(TipoArchivoProducto)
  tipo: TipoArchivoProducto;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  orden?: number;
}
