import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

const INCLUDE_ITEMS = {
  items: {
    include: {
      variante: { include: { producto: true, stock: true } },
    },
  },
} as const;

@Injectable()
export class CarritosService {
  constructor(private readonly prisma: PrismaService) {}

  async obtenerActivoOCrear(empresaId: string, clienteId: string) {
    const cliente = await this.prisma.cliente.findFirst({
      where: { id: clienteId, empresaId, deletedAt: null },
    });
    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    let carrito = await this.prisma.carrito.findFirst({
      where: { empresaId, clienteId, estado: 'ACTIVO' },
      include: INCLUDE_ITEMS,
      orderBy: { createdAt: 'desc' },
    });

    if (!carrito) {
      carrito = await this.prisma.carrito.create({
        data: { empresaId, clienteId, estado: 'ACTIVO' },
        include: INCLUDE_ITEMS,
      });
    }

    return carrito;
  }

  async agregarItem(empresaId: string, carritoId: string, dto: AddItemDto) {
    const carrito = await this.buscarActivoOFallar(empresaId, carritoId);

    const variante = await this.prisma.variante.findFirst({
      where: { id: dto.varianteId, producto: { empresaId, deletedAt: null } },
      include: { producto: true, stock: true },
    });
    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    const itemExistente = await this.prisma.carritoItem.findUnique({
      where: {
        carritoId_varianteId: { carritoId, varianteId: dto.varianteId },
      },
    });

    const cantidadFinal = (itemExistente?.cantidad ?? 0) + dto.cantidad;
    this.verificarStock(variante, cantidadFinal);

    const precioUnitario =
      Number(variante.producto.precio) + Number(variante.precioAdicional);

    await this.prisma.carritoItem.upsert({
      where: {
        carritoId_varianteId: { carritoId, varianteId: dto.varianteId },
      },
      create: {
        carritoId,
        varianteId: dto.varianteId,
        cantidad: dto.cantidad,
        precioUnitario,
      },
      update: { cantidad: cantidadFinal, precioUnitario },
    });

    await this.prisma.carrito.update({
      where: { id: carritoId },
      data: { ultimaActividadAt: new Date() },
    });

    return this.obtenerConItems(carritoId);
  }

  async actualizarItem(
    empresaId: string,
    carritoId: string,
    itemId: string,
    dto: UpdateItemDto,
  ) {
    await this.buscarActivoOFallar(empresaId, carritoId);
    const item = await this.buscarItemOFallar(carritoId, itemId);

    const variante = await this.prisma.variante.findUnique({
      where: { id: item.varianteId },
      include: { stock: true },
    });
    this.verificarStock(variante!, dto.cantidad);

    await this.prisma.carritoItem.update({
      where: { id: itemId },
      data: { cantidad: dto.cantidad },
    });

    await this.prisma.carrito.update({
      where: { id: carritoId },
      data: { ultimaActividadAt: new Date() },
    });

    return this.obtenerConItems(carritoId);
  }

  async eliminarItem(empresaId: string, carritoId: string, itemId: string) {
    await this.buscarActivoOFallar(empresaId, carritoId);
    await this.buscarItemOFallar(carritoId, itemId);

    await this.prisma.carritoItem.delete({ where: { id: itemId } });
    await this.prisma.carrito.update({
      where: { id: carritoId },
      data: { ultimaActividadAt: new Date() },
    });

    return this.obtenerConItems(carritoId);
  }

  private verificarStock(
    variante: { stock: { cantidad: number }[] },
    cantidadRequerida: number,
  ) {
    const disponible = variante.stock.reduce((sum, s) => sum + s.cantidad, 0);
    if (disponible < cantidadRequerida) {
      throw new ConflictException(
        `Stock insuficiente: disponible ${disponible}, solicitado ${cantidadRequerida}`,
      );
    }
  }

  private obtenerConItems(carritoId: string) {
    return this.prisma.carrito.findUnique({
      where: { id: carritoId },
      include: INCLUDE_ITEMS,
    });
  }

  private async buscarActivoOFallar(empresaId: string, carritoId: string) {
    const carrito = await this.prisma.carrito.findFirst({
      where: { id: carritoId, empresaId },
    });
    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }
    if (carrito.estado !== 'ACTIVO') {
      throw new ConflictException('El carrito ya no está activo');
    }
    return carrito;
  }

  private async buscarItemOFallar(carritoId: string, itemId: string) {
    const item = await this.prisma.carritoItem.findFirst({
      where: { id: itemId, carritoId },
    });
    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }
    return item;
  }
}
