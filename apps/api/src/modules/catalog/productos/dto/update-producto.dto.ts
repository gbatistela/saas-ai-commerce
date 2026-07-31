import { PartialType } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';
import { CreateProductoDto } from './create-producto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsOptional()
  @IsIn(['ACTIVO', 'INACTIVO', 'SUSPENDIDO'])
  estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
}
