import { Module } from '@nestjs/common';
import {
  ProductosController,
  VariantesController,
  ArchivosController,
} from './productos.controller';
import { ProductosService } from './productos.service';

@Module({
  controllers: [ProductosController, VariantesController, ArchivosController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductosModule {}
