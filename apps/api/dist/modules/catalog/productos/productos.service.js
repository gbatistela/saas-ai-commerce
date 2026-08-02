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
exports.ProductosService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const DEPOSITO_DEFAULT = 'principal';
let ProductosService = class ProductosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(empresaId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
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
    async obtener(empresaId, id) {
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
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async crear(empresaId, dto) {
        const skuEnUso = await this.prisma.producto.findFirst({
            where: { empresaId, sku: dto.sku },
        });
        if (skuEnUso) {
            throw new common_1.ConflictException('Ya existe un producto con ese SKU');
        }
        await this.validarCategoriaYMarca(empresaId, dto.categoriaId, dto.marcaId);
        return this.prisma.producto.create({
            data: { ...dto, empresaId },
        });
    }
    async actualizar(empresaId, id, dto) {
        await this.buscarProductoOFallar(empresaId, id);
        await this.validarCategoriaYMarca(empresaId, dto.categoriaId, dto.marcaId);
        if (dto.sku) {
            const skuEnUso = await this.prisma.producto.findFirst({
                where: { empresaId, sku: dto.sku, NOT: { id } },
            });
            if (skuEnUso) {
                throw new common_1.ConflictException('Ya existe un producto con ese SKU');
            }
        }
        return this.prisma.producto.update({ where: { id }, data: dto });
    }
    async eliminar(empresaId, id) {
        await this.buscarProductoOFallar(empresaId, id);
        return this.prisma.producto.update({
            where: { id },
            data: { estado: 'INACTIVO', deletedAt: new Date() },
        });
    }
    async agregarVariante(empresaId, productoId, dto) {
        await this.buscarProductoOFallar(empresaId, productoId);
        const skuEnUso = await this.prisma.variante.findFirst({
            where: { productoId, skuVariante: dto.skuVariante },
        });
        if (skuEnUso) {
            throw new common_1.ConflictException('Ya existe una variante con ese SKU para este producto');
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
    async actualizarVariante(empresaId, varianteId, dto) {
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
                throw new common_1.ConflictException('Ya existe una variante con ese SKU para este producto');
            }
        }
        return this.prisma.variante.update({
            where: { id: varianteId },
            data: dto,
        });
    }
    async actualizarStock(empresaId, varianteId, dto) {
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
    async agregarArchivo(empresaId, productoId, dto) {
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
    async eliminarArchivo(empresaId, archivoId) {
        const archivo = await this.prisma.archivo.findFirst({
            where: { id: archivoId, empresaId },
        });
        if (!archivo) {
            throw new common_1.NotFoundException('Archivo no encontrado');
        }
        await this.prisma.archivoProducto.deleteMany({ where: { archivoId } });
        await this.prisma.archivo.delete({ where: { id: archivoId } });
        return { eliminado: true };
    }
    async vincularRelacionado(empresaId, productoId, dto) {
        await this.buscarProductoOFallar(empresaId, productoId);
        await this.buscarProductoOFallar(empresaId, dto.relacionadoId);
        if (productoId === dto.relacionadoId) {
            throw new common_1.ConflictException('Un producto no puede estar relacionado consigo mismo');
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
    async buscarParaIA(empresaId, params, limite = 5) {
        const where = {
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
    async stockDeVariante(empresaId, varianteId) {
        const variante = await this.prisma.variante.findFirst({
            where: { id: varianteId, producto: { empresaId, deletedAt: null } },
            include: { stock: true },
        });
        if (!variante) {
            throw new common_1.NotFoundException('Variante no encontrada');
        }
        return {
            varianteId,
            disponible: variante.stock.reduce((sum, s) => sum + s.cantidad, 0),
        };
    }
    async buscarProductoOFallar(empresaId, id) {
        const producto = await this.prisma.producto.findFirst({
            where: { id, empresaId, deletedAt: null },
        });
        if (!producto) {
            throw new common_1.NotFoundException('Producto no encontrado');
        }
        return producto;
    }
    async buscarVarianteOFallar(empresaId, varianteId) {
        const variante = await this.prisma.variante.findFirst({
            where: { id: varianteId, producto: { empresaId, deletedAt: null } },
        });
        if (!variante) {
            throw new common_1.NotFoundException('Variante no encontrada');
        }
        return variante;
    }
    async validarCategoriaYMarca(empresaId, categoriaId, marcaId) {
        if (categoriaId) {
            const categoria = await this.prisma.categoria.findFirst({
                where: { id: categoriaId, empresaId },
            });
            if (!categoria) {
                throw new common_1.NotFoundException('Categoría no encontrada');
            }
        }
        if (marcaId) {
            const marca = await this.prisma.marca.findFirst({
                where: { id: marcaId, empresaId },
            });
            if (!marca) {
                throw new common_1.NotFoundException('Marca no encontrada');
            }
        }
    }
};
exports.ProductosService = ProductosService;
exports.ProductosService = ProductosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductosService);
//# sourceMappingURL=productos.service.js.map