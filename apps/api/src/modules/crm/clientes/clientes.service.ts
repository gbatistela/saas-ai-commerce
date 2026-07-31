import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClientesDto } from './dto/query-clientes.dto';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { QueryHistorialDto } from './dto/query-historial.dto';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(empresaId: string, query: QueryClientesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ClienteWhereInput = {
      empresaId,
      deletedAt: null,
      ...(query.nombre
        ? { nombre: { contains: query.nombre, mode: 'insensitive' } }
        : {}),
      ...(query.telefono ? { telefono: { contains: query.telefono } } : {}),
      ...(query.esFrecuente !== undefined
        ? { esFrecuente: query.esFrecuente === 'true' }
        : {}),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        where,
        orderBy: { [query.sort ?? 'createdAt']: query.order ?? 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.cliente.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async obtener(empresaId: string, id: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, empresaId, deletedAt: null },
      include: {
        direcciones: true,
        etiquetas: { include: { etiqueta: true } },
        pedidos: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { estados: { orderBy: { createdAt: 'desc' }, take: 1 } },
        },
      },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }

  async crear(empresaId: string, dto: CreateClienteDto) {
    const enUso = await this.prisma.cliente.findFirst({
      where: { empresaId, telefono: dto.telefono },
    });

    if (enUso) {
      throw new ConflictException('Ya existe un cliente con ese teléfono');
    }

    return this.prisma.cliente.create({
      data: { ...dto, empresaId, canalOrigen: 'MANUAL' },
    });
  }

  async actualizar(empresaId: string, id: string, dto: UpdateClienteDto) {
    await this.buscarOFallar(empresaId, id);

    if (dto.telefono) {
      const enUso = await this.prisma.cliente.findFirst({
        where: { empresaId, telefono: dto.telefono, NOT: { id } },
      });
      if (enUso) {
        throw new ConflictException('Ya existe un cliente con ese teléfono');
      }
    }

    return this.prisma.cliente.update({ where: { id }, data: dto });
  }

  async agregarDireccion(
    empresaId: string,
    clienteId: string,
    dto: CreateDireccionDto,
  ) {
    await this.buscarOFallar(empresaId, clienteId);

    if (dto.esPrincipal) {
      await this.prisma.direccion.updateMany({
        where: { clienteId },
        data: { esPrincipal: false },
      });
    }

    return this.prisma.direccion.create({
      data: { ...dto, clienteId },
    });
  }

  async historial(
    empresaId: string,
    clienteId: string,
    query: QueryHistorialDto,
  ) {
    await this.buscarOFallar(empresaId, clienteId);

    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const where: Prisma.HistorialInteraccionWhereInput = { clienteId };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.historialInteraccion.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.historialInteraccion.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  private async buscarOFallar(empresaId: string, id: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id, empresaId, deletedAt: null },
    });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    return cliente;
  }
}
