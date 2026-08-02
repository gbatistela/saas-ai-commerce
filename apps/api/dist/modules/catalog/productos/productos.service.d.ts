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
export declare class ProductosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(empresaId: string, query: QueryProductosDto): Promise<{
        data: {
            stockTotal: number;
            stockBajo: boolean;
            imagenUrl: string;
            categoria: {
                empresaId: string;
                id: string;
                nombre: string;
                categoriaPadreId: string | null;
            } | null;
            marca: {
                empresaId: string;
                id: string;
                nombre: string;
                logoUrl: string | null;
            } | null;
            empresaId: string;
            id: string;
            nombre: string;
            estado: import(".prisma/client").$Enums.EstadoGeneral;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            descripcion: string | null;
            sku: string;
            precio: Prisma.Decimal;
            costo: Prisma.Decimal | null;
            categoriaId: string | null;
            marcaId: string | null;
            peso: Prisma.Decimal | null;
            codigoBarras: string | null;
            seoSlug: string | null;
            seoMeta: string | null;
            destacado: boolean;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    obtener(empresaId: string, id: string): Promise<{
        categoria: {
            empresaId: string;
            id: string;
            nombre: string;
            categoriaPadreId: string | null;
        } | null;
        marca: {
            empresaId: string;
            id: string;
            nombre: string;
            logoUrl: string | null;
        } | null;
        archivos: ({
            archivo: {
                url: string;
                empresaId: string;
                id: string;
                createdAt: Date;
                tipoMime: string;
                tamanoBytes: number | null;
                bucket: string | null;
            };
        } & {
            id: string;
            tipo: import(".prisma/client").$Enums.TipoArchivoProducto;
            orden: number;
            productoId: string;
            archivoId: string;
        })[];
        variantes: ({
            stock: {
                id: string;
                cantidad: number;
                deposito: string | null;
                stockMinimo: number;
                varianteId: string;
            }[];
        } & {
            id: string;
            color: string | null;
            talle: string | null;
            skuVariante: string;
            precioAdicional: Prisma.Decimal;
            imagenUrl: string | null;
            productoId: string;
        })[];
        relacionadosDesde: ({
            relacionado: {
                empresaId: string;
                id: string;
                nombre: string;
                estado: import(".prisma/client").$Enums.EstadoGeneral;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                descripcion: string | null;
                sku: string;
                precio: Prisma.Decimal;
                costo: Prisma.Decimal | null;
                categoriaId: string | null;
                marcaId: string | null;
                peso: Prisma.Decimal | null;
                codigoBarras: string | null;
                seoSlug: string | null;
                seoMeta: string | null;
                destacado: boolean;
            };
        } & {
            id: string;
            tipo: import(".prisma/client").$Enums.TipoRelacionProducto;
            relacionadoId: string;
            productoId: string;
        })[];
    } & {
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: Prisma.Decimal;
        costo: Prisma.Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: Prisma.Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    crear(empresaId: string, dto: CreateProductoDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: Prisma.Decimal;
        costo: Prisma.Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: Prisma.Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    actualizar(empresaId: string, id: string, dto: UpdateProductoDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: Prisma.Decimal;
        costo: Prisma.Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: Prisma.Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    eliminar(empresaId: string, id: string): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: Prisma.Decimal;
        costo: Prisma.Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: Prisma.Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    agregarVariante(empresaId: string, productoId: string, dto: CreateVarianteDto): Promise<{
        stock: {
            id: string;
            cantidad: number;
            deposito: string | null;
            stockMinimo: number;
            varianteId: string;
        }[];
    } & {
        id: string;
        color: string | null;
        talle: string | null;
        skuVariante: string;
        precioAdicional: Prisma.Decimal;
        imagenUrl: string | null;
        productoId: string;
    }>;
    actualizarVariante(empresaId: string, varianteId: string, dto: UpdateVarianteDto): Promise<{
        id: string;
        color: string | null;
        talle: string | null;
        skuVariante: string;
        precioAdicional: Prisma.Decimal;
        imagenUrl: string | null;
        productoId: string;
    }>;
    actualizarStock(empresaId: string, varianteId: string, dto: UpdateStockDto): Promise<{
        id: string;
        cantidad: number;
        deposito: string | null;
        stockMinimo: number;
        varianteId: string;
    }>;
    agregarArchivo(empresaId: string, productoId: string, dto: CreateArchivoProductoDto): Promise<{
        archivo: {
            url: string;
            empresaId: string;
            id: string;
            createdAt: Date;
            tipoMime: string;
            tamanoBytes: number | null;
            bucket: string | null;
        };
    } & {
        id: string;
        tipo: import(".prisma/client").$Enums.TipoArchivoProducto;
        orden: number;
        productoId: string;
        archivoId: string;
    }>;
    eliminarArchivo(empresaId: string, archivoId: string): Promise<{
        eliminado: boolean;
    }>;
    vincularRelacionado(empresaId: string, productoId: string, dto: CreateRelacionadoDto): Promise<{
        id: string;
        tipo: import(".prisma/client").$Enums.TipoRelacionProducto;
        relacionadoId: string;
        productoId: string;
    }>;
    buscarParaIA(empresaId: string, params: {
        query: string;
        categoriaNombre?: string;
        precioMax?: number;
    }, limite?: number): Promise<{
        id: string;
        nombre: string;
        precio: number;
        variantes: {
            id: string;
            talle: string | null;
            color: string | null;
            stockDisponible: number;
        }[];
    }[]>;
    stockDeVariante(empresaId: string, varianteId: string): Promise<{
        varianteId: string;
        disponible: number;
    }>;
    private buscarProductoOFallar;
    private buscarVarianteOFallar;
    private validarCategoriaYMarca;
}
