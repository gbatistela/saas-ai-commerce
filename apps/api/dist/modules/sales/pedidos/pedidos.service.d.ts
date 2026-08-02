import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { QueryPedidosDto } from './dto/query-pedidos.dto';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
export declare class PedidosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    crearDesdeCarrito(empresaId: string, dto: CreatePedidoDto, usuarioId?: string): Promise<{
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
                color: string | null;
                talle: string | null;
                skuVariante: string;
                precioAdicional: Prisma.Decimal;
                imagenUrl: string | null;
                productoId: string;
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            subtotal: Prisma.Decimal;
            pedidoId: string;
            precioUnitario: Prisma.Decimal;
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
            monto: Prisma.Decimal;
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
        total: Prisma.Decimal;
        clienteId: string;
        carritoId: string | null;
        numeroPedido: string;
        subtotal: Prisma.Decimal;
        descuentoTotal: Prisma.Decimal;
        envio: Prisma.Decimal;
        cuponId: string | null;
        direccionId: string | null;
    }>;
    listar(empresaId: string, query: QueryPedidosDto): Promise<{
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
            total: Prisma.Decimal;
            clienteId: string;
            carritoId: string | null;
            numeroPedido: string;
            subtotal: Prisma.Decimal;
            descuentoTotal: Prisma.Decimal;
            envio: Prisma.Decimal;
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
    obtener(empresaId: string, id: string): Promise<{
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
                color: string | null;
                talle: string | null;
                skuVariante: string;
                precioAdicional: Prisma.Decimal;
                imagenUrl: string | null;
                productoId: string;
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            subtotal: Prisma.Decimal;
            pedidoId: string;
            precioUnitario: Prisma.Decimal;
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
            monto: Prisma.Decimal;
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
        total: Prisma.Decimal;
        clienteId: string;
        carritoId: string | null;
        numeroPedido: string;
        subtotal: Prisma.Decimal;
        descuentoTotal: Prisma.Decimal;
        envio: Prisma.Decimal;
        cuponId: string | null;
        direccionId: string | null;
    }>;
    actualizarEstado(empresaId: string, id: string, dto: ActualizarEstadoPedidoDto, usuarioId?: string): Promise<{
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
                color: string | null;
                talle: string | null;
                skuVariante: string;
                precioAdicional: Prisma.Decimal;
                imagenUrl: string | null;
                productoId: string;
            };
        } & {
            id: string;
            cantidad: number;
            varianteId: string;
            subtotal: Prisma.Decimal;
            pedidoId: string;
            precioUnitario: Prisma.Decimal;
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
            monto: Prisma.Decimal;
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
        total: Prisma.Decimal;
        clienteId: string;
        carritoId: string | null;
        numeroPedido: string;
        subtotal: Prisma.Decimal;
        descuentoTotal: Prisma.Decimal;
        envio: Prisma.Decimal;
        cuponId: string | null;
        direccionId: string | null;
    }>;
    agregarSeguimiento(empresaId: string, id: string, dto: CreateSeguimientoDto): Promise<{
        id: string;
        createdAt: Date;
        pedidoId: string;
        transportista: string | null;
        numeroTracking: string | null;
        urlTracking: string | null;
    }>;
    estadoPorNumero(empresaId: string, numeroPedido: string): Promise<{
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
        total: Prisma.Decimal;
    }>;
    private siguienteNumeroPedido;
    private buscarOFallar;
}
