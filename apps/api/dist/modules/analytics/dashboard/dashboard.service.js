"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const RANGO_DEFAULT_DIAS = 30;
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resumen(empresaId, query) {
        const { desde, hasta } = this.resolverRango(query);
        const [pedidosAgg, conversacionesCount] = await Promise.all([
            this.prisma.pedido.aggregate({
                where: { empresaId, createdAt: { gte: desde, lte: hasta } },
                _sum: { total: true },
                _count: true,
            }),
            this.prisma.conversacion.count({
                where: { empresaId, createdAt: { gte: desde, lte: hasta } },
            }),
        ]);
        const pedidosCount = pedidosAgg._count;
        const ventasTotal = Number(pedidosAgg._sum.total ?? 0);
        return {
            rango: { desde, hasta },
            ventasTotal,
            pedidosCount,
            conversacionesCount,
            tasaConversion: conversacionesCount > 0 ? pedidosCount / conversacionesCount : 0,
        };
    }
    async ventasPorDia(empresaId, query) {
        const { desde, hasta } = this.resolverRango(query);
        const filas = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT date_trunc('day', created_at) AS fecha,
             COUNT(*)::int AS cantidad_pedidos,
             COALESCE(SUM(total), 0)::numeric AS total
      FROM pedidos
      WHERE empresa_id = ${empresaId}
        AND created_at >= ${desde}
        AND created_at <= ${hasta}
      GROUP BY 1
      ORDER BY 1 ASC
    `);
        return filas.map((f) => ({
            fecha: f.fecha,
            cantidadPedidos: f.cantidad_pedidos,
            total: Number(f.total),
        }));
    }
    async productosMasVendidos(empresaId, query) {
        const { desde, hasta } = this.resolverRango(query);
        const limit = query.limit ?? 10;
        const filas = await this.prisma.$queryRaw(client_1.Prisma.sql `
      SELECT p.id AS producto_id,
             p.nombre AS producto_nombre,
             SUM(pi.cantidad)::int AS cantidad_vendida,
             SUM(pi.subtotal)::numeric AS total_vendido
      FROM pedido_items pi
      JOIN pedidos ped ON ped.id = pi.pedido_id
      JOIN variantes v ON v.id = pi.variante_id
      JOIN productos p ON p.id = v.producto_id
      WHERE ped.empresa_id = ${empresaId}
        AND ped.created_at >= ${desde}
        AND ped.created_at <= ${hasta}
      GROUP BY p.id, p.nombre
      ORDER BY cantidad_vendida DESC
      LIMIT ${limit}
    `);
        return filas.map((f) => ({
            productoId: f.producto_id,
            nombre: f.producto_nombre,
            cantidadVendida: f.cantidad_vendida,
            totalVendido: Number(f.total_vendido),
        }));
    }
    async metricasIA(empresaId, query) {
        const { desde, hasta } = this.resolverRango(query);
        const where = { empresaId, createdAt: { gte: desde, lte: hasta } };
        const [logAgg, mensajesPorEmisor, conversacionesConIA, conversacionesConHumano] = await Promise.all([
            this.prisma.logIA.aggregate({
                where,
                _sum: { tokensPrompt: true, tokensCompletion: true, costoUsd: true },
                _avg: { latenciaMs: true },
                _count: true,
            }),
            this.prisma.mensaje.groupBy({
                by: ['emisor'],
                where: { conversacion: { empresaId }, createdAt: { gte: desde, lte: hasta } },
                _count: true,
            }),
            this.prisma.mensaje.findMany({
                where: {
                    emisor: 'IA',
                    conversacion: { empresaId },
                    createdAt: { gte: desde, lte: hasta },
                },
                distinct: ['conversacionId'],
                select: { conversacionId: true },
            }),
            this.prisma.mensaje.findMany({
                where: {
                    emisor: 'HUMANO',
                    conversacion: { empresaId },
                    createdAt: { gte: desde, lte: hasta },
                },
                distinct: ['conversacionId'],
                select: { conversacionId: true },
            }),
        ]);
        return {
            rango: { desde, hasta },
            mensajesProcesados: logAgg._count,
            tokensPrompt: logAgg._sum.tokensPrompt ?? 0,
            tokensCompletion: logAgg._sum.tokensCompletion ?? 0,
            costoUsdEstimado: Number(logAgg._sum.costoUsd ?? 0),
            latenciaPromedioMs: Math.round(logAgg._avg.latenciaMs ?? 0),
            mensajesPorEmisor: Object.fromEntries(mensajesPorEmisor.map((m) => [m.emisor, m._count])),
            conversacionesAtendidasPorIA: conversacionesConIA.length,
            conversacionesConHandoffHumano: conversacionesConHumano.length,
        };
    }
    resolverRango(query) {
        const hasta = query.hasta ? new Date(query.hasta) : new Date();
        const desde = query.desde
            ? new Date(query.desde)
            : new Date(hasta.getTime() - RANGO_DEFAULT_DIAS * 24 * 60 * 60 * 1000);
        return { desde, hasta };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map