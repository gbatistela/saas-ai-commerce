import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { QueryRangoDto } from './dto/query-rango.dto';
import { QueryTopProductosDto } from './dto/query-top-productos.dto';

const RANGO_DEFAULT_DIAS = 30;

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async resumen(empresaId: string, query: QueryRangoDto) {
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
    // Ventas brutas: suma del total de los pedidos creados en el período,
    // sin descontar cancelaciones posteriores (MVP, sin embudo avanzado).
    const ventasTotal = Number(pedidosAgg._sum.total ?? 0);

    return {
      rango: { desde, hasta },
      ventasTotal,
      pedidosCount,
      conversacionesCount,
      tasaConversion: conversacionesCount > 0 ? pedidosCount / conversacionesCount : 0,
    };
  }

  async ventasPorDia(empresaId: string, query: QueryRangoDto) {
    const { desde, hasta } = this.resolverRango(query);

    const filas = await this.prisma.$queryRaw<
      { fecha: Date; cantidad_pedidos: number; total: string }[]
    >(Prisma.sql`
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

  async productosMasVendidos(empresaId: string, query: QueryTopProductosDto) {
    const { desde, hasta } = this.resolverRango(query);
    const limit = query.limit ?? 10;

    const filas = await this.prisma.$queryRaw<
      { producto_id: string; producto_nombre: string; cantidad_vendida: number; total_vendido: string }[]
    >(Prisma.sql`
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

  async metricasIA(empresaId: string, query: QueryRangoDto) {
    const { desde, hasta } = this.resolverRango(query);
    const where = { empresaId, createdAt: { gte: desde, lte: hasta } };

    const [logAgg, mensajesPorEmisor, conversacionesConIA, conversacionesConHumano] =
      await Promise.all([
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
      mensajesPorEmisor: Object.fromEntries(
        mensajesPorEmisor.map((m) => [m.emisor, m._count]),
      ),
      conversacionesAtendidasPorIA: conversacionesConIA.length,
      conversacionesConHandoffHumano: conversacionesConHumano.length,
    };
  }

  private resolverRango(query: QueryRangoDto) {
    const hasta = query.hasta ? new Date(query.hasta) : new Date();
    const desde = query.desde
      ? new Date(query.desde)
      : new Date(hasta.getTime() - RANGO_DEFAULT_DIAS * 24 * 60 * 60 * 1000);

    return { desde, hasta };
  }
}
