import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import configuration from './config/configuration';
import { PrismaModule } from './infra/prisma/prisma.module';
import { QueueModule } from './infra/queue/queue.module';
import { S3Module } from './infra/s3/s3.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { AuthModule } from './modules/identity/auth/auth.module';
import { EmpresaModule } from './modules/identity/empresa/empresa.module';
import { UsuariosModule } from './modules/identity/usuarios/usuarios.module';
import { ProductosModule } from './modules/catalog/productos/productos.module';
import { CategoriasModule } from './modules/catalog/categorias/categorias.module';
import { MarcasModule } from './modules/catalog/marcas/marcas.module';
import { ClientesModule } from './modules/crm/clientes/clientes.module';
import { ConversacionesModule } from './modules/conversations/conversaciones/conversaciones.module';
import { RespuestasRapidasModule } from './modules/conversations/respuestas-rapidas/respuestas-rapidas.module';
import { WebhooksModule } from './modules/conversations/webhooks/webhooks.module';
import { CarritosModule } from './modules/sales/carritos/carritos.module';
import { PedidosModule } from './modules/sales/pedidos/pedidos.module';
import { ReclamosModule } from './modules/support/reclamos/reclamos.module';
import { AiEngineModule } from './modules/ai-engine/ai-engine.module';
import { DashboardModule } from './modules/analytics/dashboard/dashboard.module';
import { StorefrontModule } from './modules/storefront/storefront.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { ShopifyModule } from './modules/integrations/shopify/shopify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minuto
        limit: 100, // 100 requests por minuto por IP (ajustable por env luego)
      },
    ]),
    PrismaModule,
    QueueModule,
    S3Module,
    AuthModule,
    EmpresaModule,
    UsuariosModule,
    ProductosModule,
    CategoriasModule,
    MarcasModule,
    ClientesModule,
    ConversacionesModule,
    RespuestasRapidasModule,
    WebhooksModule,
    CarritosModule,
    PedidosModule,
    ReclamosModule,
    AiEngineModule,
    DashboardModule,
    StorefrontModule,
    NotificationsModule,
    UploadsModule,
    ShopifyModule,
  ],
  providers: [
    // Orden de guards: primero autenticación (JWT), después autorización (roles)
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
