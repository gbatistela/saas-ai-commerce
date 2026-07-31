import {
  IsBoolean,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateClienteDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  esFrecuente?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  presupuestoEstimado?: number;

  @ApiPropertyOptional({ description: 'Talle preferido' })
  @IsOptional()
  @IsString()
  talleP?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  colorPreferido?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  marcaPreferida?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  metodoPagoPreferido?: string;

  @ApiPropertyOptional({
    description: 'Notas de memoria generadas/editadas manualmente sobre el cliente',
  })
  @IsOptional()
  @IsString()
  notasIA?: string;
}
