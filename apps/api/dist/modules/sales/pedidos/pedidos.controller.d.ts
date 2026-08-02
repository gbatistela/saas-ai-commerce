import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { QueryPedidosDto } from './dto/query-pedidos.dto';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class PedidosController {
    private readonly pedidosService;
    constructor(pedidosService: PedidosService);
    crear(user: AuthenticatedUser, dto: CreatePedidoDto): Promise<{
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
    listar(user: AuthenticatedUser, query: QueryPedidosDto): Promise<{
        data: ({
            cliente: {
                id: string;
                nombre: string | null;
                telefono: string | null;
            };
            estados: {
                id: string;
                estado: import(".prisma/client").$Enums.EstadoPedidoEnum;
                createdAt: Date;
                usuarioId: string | null;
                pedidoId: string;
                comentario: string | null;
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
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    estadoPublico(numeroPedido: string, empresaId: string): Promise<{
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
    obtener(user: AuthenticatedUser, id: string): Promise<{
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
    actualizarEstado(user: AuthenticatedUser, id: string, dto: ActualizarEstadoPedidoDto): Promise<{
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
    agregarSeguimiento(user: AuthenticatedUser, id: string, dto: CreateSeguimientoDto): Promise<{
        id: string;
        createdAt: Date;
        pedidoId: string;
        transportista: string | null;
        numeroTracking: string | null;
        urlTracking: string | null;
    }>;
}
