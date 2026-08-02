import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryProductosDto } from './dto/query-productos.dto';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateArchivoProductoDto } from './dto/create-archivo-producto.dto';
import { CreateRelacionadoDto } from './dto/create-relacionado.dto';

const DEPOSITO_DEFAULT = 'principal';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(empresaId: string, query: QueryProductosDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ProductoWhereInput = {
      empresaId,
      deletedAt: null,
      ...(query.categoria ? { categoriaId: query.categoria } : {}),
      ...(query.marca ? { marcaId: query.marca } : {}),
      ...(query.estado ? { estado: query.estado } : {}),
      ...(query.texto
        ? {
            OR: [
              { nombre: { contains: query.texto, mode: 'insensitive' } },
              { sku: { contains: query.texto, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [productos, total] = await this.prisma.$transaction([
      this.prisma.producto.findMany({
        where,
        include: {
          categoria: true,
          marca: true,
          variantes: { select: { stock: { select: { cantidad: true, stockMinimo: true } } } },
        },
        orderBy: { [query.sort ?? 'createdAt']: query.order ?? 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.producto.count({ where }),
    ]);

    const data = productos.map(({ variantes, ...producto }) => {
      const stocks = variantes.flatMap((v) => v.stock);
      return {
        ...producto,
        stockTotal: stocks.reduce((sum, s) => sum + s.cantidad, 0),
        stockBajo: stocks.some((s) => s.cantidad <= s.stockMinimo),
      };
    });

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async obtener(empresaId: string, id: string) {
    const producto = await this.prisma.producto.findFirst({
      where: { id, empresaId, deletedAt: null },
      include: {
        categoria: true,
        marca: true,
        variantes: { include: { stock: true } },
        archivos: { include: { archivo: true }, orderBy: { orden: 'asc' } },
        relacionadosDesde: { include: { relacionado: true } },
      },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  async crear(empresaId: string, dto: CreateProductoDto) {
    const skuEnUso = await this.prisma.producto.findFirst({
      where: { empresaId, sku: dto.sku },
    });

    if (skuEnUso) {
      throw new ConflictException('Ya existe un producto con ese SKU');
    }

    await this.validarCategoriaYMarca(empresaId, dto.categoriaId, dto.marcaId);

    return this.prisma.producto.create({
      data: { ...dto, empresaId },
    });
  }

  async actualizar(empresaId: string, id: string, dto: UpdateProductoDto) {
    await this.buscarProductoOFallar(empresaId, id);
    await this.validarCategoriaYMarca(empresaId, dto.categoriaId, dto.marcaId);

    if (dto.sku) {
      const skuEnUso = await this.prisma.producto.findFirst({
        where: { empresaId, sku: dto.sku, NOT: { id } },
      });
      if (skuEnUso) {
        throw new ConflictException('Ya existe un producto con ese SKU');
      }
    }

    return this.prisma.producto.update({ where: { id }, data: dto });
  }

  async eliminar(empresaId: string, id: string) {
    await this.buscarProductoOFallar(empresaId, id);

    return this.prisma.producto.update({
      where: { id },
      data: { estado: 'INACTIVO', deletedAt: new Date() },
    });
  }

  async agregarVariante(
    empresaId: string,
    productoId: string,
    dto: CreateVarianteDto,
  ) {
    await this.buscarProductoOFallar(empresaId, productoId);

    const skuEnUso = await this.prisma.variante.findFirst({
      where: { productoId, skuVariante: dto.skuVariante },
    });
    if (skuEnUso) {
      throw new ConflictException(
        'Ya existe una variante con ese SKU para este producto',
      );
    }

    return this.prisma.variante.create({
      data: {
        ...dto,
        productoId,
        stock: { create: { cantidad: 0, deposito: DEPOSITO_DEFAULT } },
      },
      include: { stock: true },
    });
  }

  async actualizarVariante(
    empresaId: string,
    varianteId: string,
    dto: UpdateVarianteDto,
  ) {
    const variante = await this.buscarVarianteOFallar(empresaId, varianteId);

    if (dto.skuVariante) {
      const skuEnUso = await this.prisma.variante.findFirst({
        where: {
          productoId: variante.productoId,
          skuVariante: dto.skuVariante,
          NOT: { id: varianteId },
        },
      });
      if (skuEnUso) {
        throw new ConflictException(
          'Ya existe una variante con ese SKU para este producto',
        );
      }
    }

    return this.prisma.variante.update({
      where: { id: varianteId },
      data: dto,
    });
  }

  async actualizarStock(
    empresaId: string,
    varianteId: string,
    dto: UpdateStockDto,
  ) {
    await this.buscarVarianteOFallar(empresaId, varianteId);
    const deposito = dto.deposito ?? DEPOSITO_DEFAULT;

    return this.prisma.stock.upsert({
      where: { varianteId_deposito: { varianteId, deposito } },
      create: {
        varianteId,
        deposito,
        cantidad: dto.cantidad,
        stockMinimo: dto.stockMinimo ?? 0,
      },
      update: {
        cantidad: dto.cantidad,
        ...(dto.stockMinimo !== undefined
          ? { stockMinimo: dto.stockMinimo }
          : {}),
      },
    });
  }

  async agregarArchivo(
    empresaId: string,
    productoId: string,
    dto: CreateArchivoProductoDto,
  ) {
    await this.buscarProductoOFallar(empresaId, productoId);

    const archivo = await this.prisma.archivo.create({
      data: {
        empresaId,
        url: dto.url,
        tipoMime: dto.tipoMime,
        tamanoBytes: dto.tamanoBytes,
        bucket: dto.bucket,
      },
    });

    return this.prisma.archivoProducto.create({
      data: {
        productoId,
        archivoId: archivo.id,
        tipo: dto.tipo,
        orden: dto.orden ?? 0,
      },
      include: { archivo: true },
    });
  }

  async eliminarArchivo(empresaId: string, archivoId: string) {
    const archivo = await this.prisma.archivo.findFirst({
      where: { id: archivoId, empresaId },
    });

    if (!archivo) {
      throw new NotFoundException('Archivo no encontrado');
    }

    await this.prisma.archivoProducto.deleteMany({ where: { archivoId } });
    await this.prisma.archivo.delete({ where: { id: archivoId } });

    return { eliminado: true };
  }

  async vincularRelacionado(
    empresaId: string,
    productoId: string,
    dto: CreateRelacionadoDto,
  ) {
    await this.buscarProductoOFallar(empresaId, productoId);
    await this.buscarProductoOFallar(empresaId, dto.relacionadoId);

    if (productoId === dto.relacionadoId) {
      throw new ConflictException(
        'Un producto no puede estar relacionado consigo mismo',
      );
    }

    const yaExiste = await this.prisma.productoRelacionado.findFirst({
      where: { productoId, relacionadoId: dto.relacionadoId, tipo: dto.tipo },
    });
    if (yaExiste) {
      return yaExiste;
    }

    return this.prisma.productoRelacionado.create({
      data: {
        productoId,
        relacionadoId: dto.relacionadoId,
        tipo: dto.tipo,
      },
    });
  }

  /**
   * Búsqueda compacta para el AI Engine (function calling): a diferencia de
   * `listar()` (pensado para el panel, paginado, con categoria/marca),
   * esta devuelve solo lo que el modelo necesita para responder al
   * cliente: nombre, precio y stock resumido por variante, en una sola
   * query (sin N+1).
   */
  async buscarParaIA(
    empresaId: string,
    params: { query: string; categoriaNombre?: string; precioMax?: number },
    limite = 5,
  ) {
    const where: Prisma.ProductoWhereInput = {
      empresaId,
      deletedAt: null,
      estado: 'ACTIVO',
      ...(params.query
        ? {
            OR: [
              { nombre: { contains: params.query, mode: 'insensitive' } },
              { descripcion: { contains: params.query, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(params.precioMax !== undefined
        ? { precio: { lte: params.precioMax } }
        : {}),
      ...(params.categoriaNombre
        ? {
            categoria: {
              nombre: { equals: params.categoriaNombre, mode: 'insensitive' },
            },
          }
        : {}),
    };

    const productos = await this.prisma.producto.findMany({
      where,
      take: limite,
      orderBy: { destacado: 'desc' },
      include: { variantes: { include: { stock: true } } },
    });

    return productos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      precio: Number(p.precio),
      variantes: p.variantes.map((v) => ({
        id: v.id,
        talle: v.talle,
        color: v.color,
        stockDisponible: v.stock.reduce((sum, s) => sum + s.cantidad, 0),
      })),
    }));
  }

  /** Stock resumido de una variante, usado por la función consultar_stock del AI Engine. */
  async stockDeVariante(empresaId: string, varianteId: string) {
    const variante = await this.prisma.variante.findFirst({
      where: { id: varianteId, producto: { empresaId, deletedAt: null } },
      include: { stock: true },
    });

    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    return {
      varianteId,
      disponible: variante.stock.reduce((sum, s) => sum + s.cantidad, 0),
    };
  }

  private async buscarProductoOFallar(empresaId: string, id: string) {
    const producto = await this.prisma.producto.findFirst({
      where: { id, empresaId, deletedAt: null },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    return producto;
  }

  private async buscarVarianteOFallar(empresaId: string, varianteId: string) {
    const variante = await this.prisma.variante.findFirst({
      where: { id: varianteId, producto: { empresaId, deletedAt: null } },
    });

    if (!variante) {
      throw new NotFoundException('Variante no encontrada');
    }

    return variante;
  }

  private async validarCategoriaYMarca(
    empresaId: string,
    categoriaId?: string,
    marcaId?: string,
  ) {
    if (categoriaId) {
      const categoria = await this.prisma.categoria.findFirst({
        where: { id: categoriaId, empresaId },
      });
      if (!categoria) {
        throw new NotFoundException('Categoría no encontrada');
      }
    }

    if (marcaId) {
      const marca = await this.prisma.marca.findFirst({
        where: { id: marcaId, empresaId },
      });
      if (!marca) {
        throw new NotFoundException('Marca no encontrada');
      }
    }
  }
}
