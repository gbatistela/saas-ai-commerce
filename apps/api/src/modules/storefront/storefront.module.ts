import { Module } from '@nestjs/common';
import { ProductosModule } from '../catalog/productos/productos.module';
import { CategoriasModule } from '../catalog/categorias/categorias.module';
import { CarritosModule } from '../sales/carritos/carritos.module';
import { PedidosModule } from '../sales/pedidos/pedidos.module';
import { ClientesModule } from '../crm/clientes/clientes.module';
import { StorefrontController } from './storefront.controller';
import { StorefrontService } from './storefront.service';

@Module({
  imports: [ProductosModule, CategoriasModule, CarritosModule, PedidosModule, ClientesModule],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
