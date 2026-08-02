import { StorefrontService } from './storefront.service';
import { QueryStorefrontProductosDto } from './dto/query-storefront-productos.dto';
import { AddCarritoItemDto } from './dto/add-carrito-item.dto';
import { UpdateCarritoItemStorefrontDto } from './dto/update-carrito-item.dto';
import { CheckoutStorefrontDto } from './dto/checkout.dto';
export declare class StorefrontController {
    private readonly storefrontService;
    constructor(storefrontService: StorefrontService);
    obtenerInfo(slug: string): Promise<{
        nombre: string;
        logoUrl: string | null;
        moneda: string;
        rubro: string | null;
    }>;
    listarProductos(slug: string, query: QueryStorefrontProductosDto): Promise<{
        data: {
            stockTotal: number;
            stockBajo: boolean;
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
    obtenerProducto(slug: string, id: string): Promise<{
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
                empresaId: string;
                id: string;
                createdAt: Date;
                url: string;
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
    listarCategorias(slug: string): Promise<({
        subcategorias: ({
            subcategorias: {
                empresaId: string;
                id: string;
                nombre: string;
                categoriaPadreId: string | null;
            }[];
        } & {
            empresaId: string;
            id: string;
            nombre: string;
            categoriaPadreId: string | null;
        })[];
    } & {
        empresaId: string;
        id: string;
        nombre: string;
        categoriaPadreId: string | null;
    })[]>;
    obtenerCarrito(slug: string, sessionId: string): Promise<{
        items: ({
            variante: {
                producto: {
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
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            carritoId: string;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoCarrito;
        createdAt: Date;
        clienteId: string;
        ultimaActividadAt: Date;
    }>;
    agregarItem(slug: string, dto: AddCarritoItemDto): Promise<({
        items: ({
            variante: {
                producto: {
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
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            carritoId: string;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoCarrito;
        createdAt: Date;
        clienteId: string;
        ultimaActividadAt: Date;
    }) | null>;
    actualizarItem(slug: string, itemId: string, dto: UpdateCarritoItemStorefrontDto): Promise<({
        items: ({
            variante: {
                producto: {
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
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            carritoId: string;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoCarrito;
        createdAt: Date;
        clienteId: string;
        ultimaActividadAt: Date;
    }) | null>;
    eliminarItem(slug: string, itemId: string, sessionId: string): Promise<({
        items: ({
            variante: {
                producto: {
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
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            carritoId: string;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
    } & {
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoCarrito;
        createdAt: Date;
        clienteId: string;
        ultimaActividadAt: Date;
    }) | null>;
    checkout(slug: string, dto: CheckoutStorefrontDto): Promise<{
        cliente: {
            id: string;
            nombre: string | null;
            telefono: string | null;
        };
        items: ({
            variante: {
                producto: {
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
                color: string | null;
                talle: string | null;
                skuVariante: string;
                precioAdicional: import("@prisma/client/runtime/library").Decimal;
                imagenUrl: string | null;
                productoId: string;
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            pedidoId: string;
            precioUnitario: import("@prisma/client/runtime/library").Decimal;
        })[];
        pagos: {
            empresaId: string;
            id: string;
            estado: import(".prisma/client").$Enums.EstadoPago;
            createdAt: Date;
            updatedAt: Date;
            moneda: string;
            pedidoId: string;
            proveedor: import(".prisma/client").$Enums.ProveedorPago;
            monto: import("@prisma/client/runtime/library").Decimal;
            linkPago: string | null;
            qrUrl: string | null;
            externalId: string | null;
        }[];
        estados: {
            id: string;
            estado: import(".prisma/client").$Enums.EstadoPedidoEnum;
            createdAt: Date;
            usuarioId: string | null;
            pedidoId: string;
            comentario: string | null;
        }[];
        seguimiento: {
            id: string;
            createdAt: Date;
            pedidoId: string;
            transportista: string | null;
            numeroTracking: string | null;
            urlTracking: string | null;
        }[];
    } & {
        empresaId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        clienteId: string;
        carritoId: string | null;
        numeroPedido: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        descuentoTotal: import("@prisma/client/runtime/library").Decimal;
        envio: import("@prisma/client/runtime/library").Decimal;
        cuponId: string | null;
        direccionId: string | null;
    }>;
    estadoPedido(slug: string, numeroPedido: string, contacto: string): Promise<{
        numeroPedido: string;
        estadoActual: import(".prisma/client").$Enums.EstadoPedidoEnum;
        historial: {
            id: string;
            estado: import(".prisma/client").$Enums.EstadoPedidoEnum;
            createdAt: Date;
            usuarioId: string | null;
            pedidoId: string;
            comentario: string | null;
        }[];
        seguimiento: {
            id: string;
            createdAt: Date;
            pedidoId: string;
            transportista: string | null;
            numeroTracking: string | null;
            urlTracking: string | null;
        }[];
        total: import("@prisma/client/runtime/library").Decimal;
    }>;
}
