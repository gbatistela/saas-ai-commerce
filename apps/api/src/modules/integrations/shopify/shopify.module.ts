import { Module } from '@nestjs/common';
import { ShopifyController } from './shopify.controller';
import { ShopifyWebhooksController } from './shopify-webhooks.controller';
import { ShopifyApiClient } from './shopify-api.client';
import { ShopifySyncService } from './shopify-sync.service';
import { ShopifyOrdersService } from './shopify-orders.service';
import { PedidosModule } from '../../sales/pedidos/pedidos.module';
import { ClientesModule } from '../../crm/clientes/clientes.module';
import { ConversacionesModule } from '../../conversations/conversaciones/conversaciones.module';

@Module({
  imports: [PedidosModule, ClientesModule, ConversacionesModule],
  controllers: [ShopifyController, ShopifyWebhooksController],
  providers: [ShopifyApiClient, ShopifySyncService, ShopifyOrdersService],
})
export class ShopifyModule {}
