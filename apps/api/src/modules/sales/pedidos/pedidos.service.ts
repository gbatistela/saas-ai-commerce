import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { QueryPedidosDto } from './dto/query-pedidos.dto';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';

const INCLUDE_DETALLE = {
  items: { include: { variante: { include: { producto: true } } } },
  estados: { orderBy: { createdAt: 'desc' as const } },
  pagos: true,
  seguimiento: true,
  cliente: { select: { id: true, nombre: true, telefono: true } },
} satisfies Prisma.PedidoInclude;

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async crearDesdeCarrito(
    empresaId: string,
    dto: CreatePedidoDto,
    usuarioId?: string,
  ) {
    const carrito = await this.prisma.carrito.findFirst({
      where: { id: dto.carritoId, empresaId, estado: 'ACTIVO' },
      include: {
        items: { include: { variante: { include: { stock: true } } } },
      },
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado o ya no está activo');
    }
    if (carrito.items.length === 0) {
      throw new ConflictException('El carrito no tiene items');
    }

    for (const item of carrito.items) {
      const disponible = item.variante.stock.reduce(
        (sum, s) => sum + s.cantidad,
        0,
      );
      if (disponible < item.cantidad) {
        throw new ConflictException(
          `Stock insuficiente para la variante ${item.varianteId}`,
        );
      }
    }

    if (dto.direccionId) {
      const direccion = await this.prisma.direccion.findFirst({
        where: { id: dto.direccionId, clienteId: carrito.clienteId },
      });
      if (!direccion) {
        throw new NotFoundException('Dirección no encontrada para el cliente');
      }
    }

    const subtotal = carrito.items.reduce(
      (sum, item) => sum + item.cantidad * Number(item.precioUnitario),
      0,
    );

    for (let intento = 0; intento < 3; intento++) {
      const numeroPedido = await this.siguienteNumeroPedido(empresaId);

      try {
        return await this.prisma.$transaction(async (tx) => {
          const pedido = await tx.pedido.create({
            data: {
              empresaId,
              clienteId: carrito.clienteId,
              carritoId: carrito.id,
              numeroPedido,
              subtotal,
              descuentoTotal: 0,
              envio: 0,
              total: subtotal,
              direccionId: dto.direccionId,
              items: {
                create: carrito.items.map((item) => ({
                  varianteId: item.varianteId,
                  cantidad: item.cantidad,
                  precioUnitario: item.precioUnitario,
                  subtotal: item.cantidad * Number(item.precioUnitario),
                })),
              },
              estados: {
                create: {
                  estado: 'PENDIENTE',
                  usuarioId,
                },
              },
            },
            include: INCLUDE_DETALLE,
          });

          await tx.carrito.update({
            where: { id: carrito.id },
            data: { estado: 'CONVERTIDO' },
          });

          return pedido;
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          continue; // colisión de numeroPedido, reintenta con el siguiente
        }
        throw error;
      }
    }

    throw new ConflictException(
      'No se pudo generar un número de pedido único, reintentá',
    );
  }

  async listar(empresaId: string, query: QueryPedidosDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    let idsPorEstado: string[] | undefined;
    if (query.estado) {
      const filas = await this.prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
        SELECT p.id FROM pedidos p
        WHERE p.empresa_id = ${empresaId}
        AND (
          SELECT eph.estado FROM estados_pedido eph
          WHERE eph.pedido_id = p.id
          ORDER BY eph.created_at DESC
          LIMIT 1
        ) = ${query.estado}::"EstadoPedidoEnum"
      `);
      idsPorEstado = filas.map((f) => f.id);
    }

    const where: Prisma.PedidoWhereInput = {
      empresaId,
      ...(idsPorEstado ? { id: { in: idsPorEstado } } : {}),
      ...(query.cliente ? { clienteId: query.cliente } : {}),
      ...(query.fechaDesde || query.fechaHasta
        ? {
            createdAt: {
              ...(query.fechaDesde ? { gte: new Date(query.fechaDesde) } : {}),
              ...(query.fechaHasta ? { lte: new Date(query.fechaHasta) } : {}),
            },
          }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.pedido.findMany({
        where,
        include: {
          cliente: { select: { id: true, nombre: true, telefono: true } },
          estados: { orderBy: { createdAt: 'desc' }, take: 1 },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.pedido.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async obtener(empresaId: string, id: string) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { id, empresaId },
      include: INCLUDE_DETALLE,
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return pedido;
  }

  async actualizarEstado(
    empresaId: string,
    id: string,
    dto: ActualizarEstadoPedidoDto,
    usuarioId?: string,
  ) {
    await this.buscarOFallar(empresaId, id);

    await this.prisma.estadoPedidoHistorial.create({
      data: {
        pedidoId: id,
        estado: dto.estado,
        comentario: dto.comentario,
        usuarioId,
      },
    });

    return this.obtener(empresaId, id);
  }

  async agregarSeguimiento(
    empresaId: string,
    id: string,
    dto: CreateSeguimientoDto,
  ) {
    await this.buscarOFallar(empresaId, id);

    return this.prisma.seguimientoEnvio.create({
      data: { pedidoId: id, ...dto },
    });
  }

  /** Usado tanto por el endpoint público como por el AI Engine (function calling). */
  async estadoPorNumero(empresaId: string, numeroPedido: string) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { empresaId, numeroPedido },
      include: {
        estados: { orderBy: { createdAt: 'desc' } },
        seguimiento: true,
      },
    });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    return {
      numeroPedido: pedido.numeroPedido,
      estadoActual: pedido.estados[0]?.estado ?? null,
      historial: pedido.estados,
      seguimiento: pedido.seguimiento,
      total: pedido.total,
    };
  }

  private async siguienteNumeroPedido(empresaId: string): Promise<string> {
    const total = await this.prisma.pedido.count({ where: { empresaId } });
    return String(total + 1).padStart(6, '0');
  }

  private async buscarOFallar(empresaId: string, id: string) {
    const pedido = await this.prisma.pedido.findFirst({
      where: { id, empresaId },
    });
    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return pedido;
  }
}
