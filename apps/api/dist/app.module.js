"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const throttler_1 = require("@nestjs/throttler");
const configuration_1 = require("./config/configuration");
const prisma_module_1 = require("./infra/prisma/prisma.module");
const queue_module_1 = require("./infra/queue/queue.module");
const s3_module_1 = require("./infra/s3/s3.module");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const jwt_auth_guard_1 = require("./common/guards/jwt-auth.guard");
const roles_guard_1 = require("./common/guards/roles.guard");
const auth_module_1 = require("./modules/identity/auth/auth.module");
const empresa_module_1 = require("./modules/identity/empresa/empresa.module");
const usuarios_module_1 = require("./modules/identity/usuarios/usuarios.module");
const productos_module_1 = require("./modules/catalog/productos/productos.module");
const categorias_module_1 = require("./modules/catalog/categorias/categorias.module");
const marcas_module_1 = require("./modules/catalog/marcas/marcas.module");
const clientes_module_1 = require("./modules/crm/clientes/clientes.module");
const conversaciones_module_1 = require("./modules/conversations/conversaciones/conversaciones.module");
const respuestas_rapidas_module_1 = require("./modules/conversations/respuestas-rapidas/respuestas-rapidas.module");
const webhooks_module_1 = require("./modules/conversations/webhooks/webhooks.module");
const carritos_module_1 = require("./modules/sales/carritos/carritos.module");
const pedidos_module_1 = require("./modules/sales/pedidos/pedidos.module");
const reclamos_module_1 = require("./modules/support/reclamos/reclamos.module");
const ai_engine_module_1 = require("./modules/ai-engine/ai-engine.module");
const dashboard_module_1 = require("./modules/analytics/dashboard/dashboard.module");
const storefront_module_1 = require("./modules/storefront/storefront.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const uploads_module_1 = require("./modules/uploads/uploads.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 100,
                },
            ]),
            prisma_module_1.PrismaModule,
            queue_module_1.QueueModule,
            s3_module_1.S3Module,
            auth_module_1.AuthModule,
            empresa_module_1.EmpresaModule,
            usuarios_module_1.UsuariosModule,
            productos_module_1.ProductosModule,
            categorias_module_1.CategoriasModule,
            marcas_module_1.MarcasModule,
            clientes_module_1.ClientesModule,
            conversaciones_module_1.ConversacionesModule,
            respuestas_rapidas_module_1.RespuestasRapidasModule,
            webhooks_module_1.WebhooksModule,
            carritos_module_1.CarritosModule,
            pedidos_module_1.PedidosModule,
            reclamos_module_1.ReclamosModule,
            ai_engine_module_1.AiEngineModule,
            dashboard_module_1.DashboardModule,
            storefront_module_1.StorefrontModule,
            notifications_module_1.NotificationsModule,
            uploads_module_1.UploadsModule,
        ],
        providers: [
            { provide: core_1.APP_GUARD, useClass: jwt_auth_guard_1.JwtAuthGuard },
            { provide: core_1.APP_GUARD, useClass: roles_guard_1.RolesGuard },
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
            { provide: core_1.APP_FILTER, useClass: http_exception_filter_1.HttpExceptionFilter },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map