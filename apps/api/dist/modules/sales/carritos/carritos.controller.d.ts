import { CarritosService } from './carritos.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class CarritosController {
    private readonly carritosService;
    constructor(carritosService: CarritosService);
    obtenerActivo(user: AuthenticatedUser, clienteId: string): Promise<{
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
    agregarItem(user: AuthenticatedUser, id: string, dto: AddItemDto): Promise<({
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
    actualizarItem(user: AuthenticatedUser, id: string, itemId: string, dto: UpdateItemDto): Promise<({
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
    eliminarItem(user: AuthenticatedUser, id: string, itemId: string): Promise<({
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
}
