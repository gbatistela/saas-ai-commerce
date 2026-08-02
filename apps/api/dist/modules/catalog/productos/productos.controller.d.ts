import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryProductosDto } from './dto/query-productos.dto';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateArchivoProductoDto } from './dto/create-archivo-producto.dto';
import { CreateRelacionadoDto } from './dto/create-relacionado.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class ProductosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    listar(user: AuthenticatedUser, query: QueryProductosDto): Promise<{
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
            precio: import("@prisma/client/runtime/library").Decimal;
            costo: import("@prisma/client/runtime/library").Decimal | null;
            categoriaId: string | null;
            marcaId: string | null;
            peso: import("@prisma/client/runtime/library").Decimal | null;
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
    obtener(user: AuthenticatedUser, id: string): Promise<{
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
            precioAdicional: import("@prisma/client/runtime/library").Decimal;
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
                precio: import("@prisma/client/runtime/library").Decimal;
                costo: import("@prisma/client/runtime/library").Decimal | null;
                categoriaId: string | null;
                marcaId: string | null;
                peso: import("@prisma/client/runtime/library").Decimal | null;
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
        precio: import("@prisma/client/runtime/library").Decimal;
        costo: import("@prisma/client/runtime/library").Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: import("@prisma/client/runtime/library").Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    crear(user: AuthenticatedUser, dto: CreateProductoDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        costo: import("@prisma/client/runtime/library").Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: import("@prisma/client/runtime/library").Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    actualizar(user: AuthenticatedUser, id: string, dto: UpdateProductoDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        costo: import("@prisma/client/runtime/library").Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: import("@prisma/client/runtime/library").Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    eliminar(user: AuthenticatedUser, id: string): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        estado: import(".prisma/client").$Enums.EstadoGeneral;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        descripcion: string | null;
        sku: string;
        precio: import("@prisma/client/runtime/library").Decimal;
        costo: import("@prisma/client/runtime/library").Decimal | null;
        categoriaId: string | null;
        marcaId: string | null;
        peso: import("@prisma/client/runtime/library").Decimal | null;
        codigoBarras: string | null;
        seoSlug: string | null;
        seoMeta: string | null;
        destacado: boolean;
    }>;
    agregarVariante(user: AuthenticatedUser, productoId: string, dto: CreateVarianteDto): Promise<{
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
        precioAdicional: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        productoId: string;
    }>;
    agregarArchivo(user: AuthenticatedUser, productoId: string, dto: CreateArchivoProductoDto): Promise<{
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
    vincularRelacionado(user: AuthenticatedUser, productoId: string, dto: CreateRelacionadoDto): Promise<{
        id: string;
        tipo: import(".prisma/client").$Enums.TipoRelacionProducto;
        relacionadoId: string;
        productoId: string;
    }>;
}
export declare class VariantesController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    actualizar(user: AuthenticatedUser, id: string, dto: UpdateVarianteDto): Promise<{
        id: string;
        color: string | null;
        talle: string | null;
        skuVariante: string;
        precioAdicional: import("@prisma/client/runtime/library").Decimal;
        imagenUrl: string | null;
        productoId: string;
    }>;
    actualizarStock(user: AuthenticatedUser, id: string, dto: UpdateStockDto): Promise<{
        id: string;
        cantidad: number;
        deposito: string | null;
        stockMinimo: number;
        varianteId: string;
    }>;
}
export declare class ArchivosController {
    private readonly productosService;
    constructor(productosService: ProductosService);
    eliminar(user: AuthenticatedUser, id: string): Promise<{
        eliminado: boolean;
    }>;
}
