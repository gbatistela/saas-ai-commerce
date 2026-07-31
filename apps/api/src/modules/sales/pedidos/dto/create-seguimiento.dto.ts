import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSeguimientoDto {
  @ApiPropertyOptional({ example: 'Correo Argentino' })
  @IsOptional()
  @IsString()
  transportista?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numeroTracking?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  urlTracking?: string;
}
