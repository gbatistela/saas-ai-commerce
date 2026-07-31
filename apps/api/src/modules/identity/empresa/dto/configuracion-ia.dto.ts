import {
  IsIn,
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ConfiguracionIaDto {
  @ApiPropertyOptional({ example: 'cercano y profesional' })
  @IsOptional()
  @IsString()
  tono?: string;

  @ApiPropertyOptional({
    description: 'Reglas de negocio libres que el prompt del sistema debe respetar',
  })
  @IsOptional()
  @IsObject()
  reglasNegocioJson?: Record<string, unknown>;

  @ApiPropertyOptional({ enum: ['gpt-4o-mini', 'gpt-4o'], default: 'gpt-4o-mini' })
  @IsOptional()
  @IsIn(['gpt-4o-mini', 'gpt-4o'])
  modeloOpenai?: string;

  @ApiPropertyOptional({ default: 0.7, minimum: 0, maximum: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ default: 600 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(50)
  @Max(4000)
  maxTokens?: number;

  @ApiPropertyOptional({ description: 'Horario de atención, formato libre' })
  @IsOptional()
  @IsObject()
  horarioAtencionJson?: Record<string, unknown>;

  @ApiPropertyOptional({
    description: 'Condiciones bajo las cuales la IA debe derivar a un humano',
  })
  @IsOptional()
  @IsObject()
  condicionesHandoffJson?: Record<string, unknown>;
}
