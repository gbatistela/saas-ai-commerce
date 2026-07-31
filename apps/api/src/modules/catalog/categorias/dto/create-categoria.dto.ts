import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ example: 'Camperas' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiPropertyOptional({ description: 'ID de la categoría padre (para subcategorías)' })
  @IsOptional()
  @IsUUID()
  categoriaPadreId?: string;
}
