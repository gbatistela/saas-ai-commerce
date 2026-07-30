import { IsIn, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ enum: ['ADMIN', 'AGENTE'] })
  @IsOptional()
  @IsIn(['ADMIN', 'AGENTE'])
  rol?: 'ADMIN' | 'AGENTE';

  @ApiPropertyOptional({ enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'] })
  @IsOptional()
  @IsIn(['ACTIVO', 'INACTIVO', 'SUSPENDIDO'])
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
}
