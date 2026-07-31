import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { QueryReclamosDto } from './dto/query-reclamos.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import { CreateArchivoReclamoDto } from './dto/create-archivo-reclamo.dto';

@Injectable()
export class ReclamosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(empresaId: string, dto: CreateReclamoDto) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: dto.clienteId, empresaId, deletedAt: null },
    });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (dto.pedidoId) {
      const pedido = await this.prisma.pedido.findFirst({
        where: { id: dto.pedidoId, empresaId },
      });
      if (!pedido) {
        throw new NotFoundException('Pedido no encontrado');
      }
    }

    return this.prisma.reclamo.create({
      data: { ...dto, empresaId },
    });
  }

  async listar(empresaId: string, query: QueryReclamosDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ReclamoWhereInput = {
      empresaId,
      ...(query.estado ? { estado: query.estado } : {}),
      ...(query.prioridad ? { prioridad: query.prioridad } : {}),
      ...(query.asignadoA ? { asignadoAId: query.asignadoA } : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.reclamo.findMany({
        where,
        include: {
          cliente: { select: { id: true, nombre: true, telefono: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.reclamo.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async obtener(empresaId: string, id: string) {
    const reclamo = await this.prisma.reclamo.findFirst({
      where: { id, empresaId },
      include: {
        cliente: { select: { id: true, nombre: true, telefono: true } },
        pedido: { select: { id: true, numeroPedido: true } },
        archivos: { include: { archivo: true } },
      },
    });

    if (!reclamo) {
      throw new NotFoundException('Reclamo no encontrado');
    }

    return reclamo;
  }

  async actualizar(empresaId: string, id: string, dto: UpdateReclamoDto) {
    await this.buscarOFallar(empresaId, id);

    if (dto.asignadoAId) {
      const usuario = await this.prisma.usuario.findFirst({
        where: { id: dto.asignadoAId, empresaId, deletedAt: null },
      });
      if (!usuario) {
        throw new NotFoundException('Usuario no encontrado en esta empresa');
      }
    }

    return this.prisma.reclamo.update({ where: { id }, data: dto });
  }

  async agregarArchivo(
    empresaId: string,
    id: string,
    dto: CreateArchivoReclamoDto,
  ) {
    await this.buscarOFallar(empresaId, id);

    const archivo = await this.prisma.archivo.create({
      data: {
        empresaId,
        url: dto.url,
        tipoMime: dto.tipoMime,
        tamanoBytes: dto.tamanoBytes,
        bucket: dto.bucket,
      },
    });

    return this.prisma.archivoReclamo.create({
      data: { reclamoId: id, archivoId: archivo.id, tipo: dto.tipo },
      include: { archivo: true },
    });
  }

  private async buscarOFallar(empresaId: string, id: string) {
    const reclamo = await this.prisma.reclamo.findFirst({
      where: { id, empresaId },
    });
    if (!reclamo) {
      throw new NotFoundException('Reclamo no encontrado');
    }
    return reclamo;
  }
}
