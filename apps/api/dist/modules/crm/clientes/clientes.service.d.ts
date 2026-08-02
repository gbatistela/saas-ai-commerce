import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClientesDto } from './dto/query-clientes.dto';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { QueryHistorialDto } from './dto/query-historial.dto';
export declare class ClientesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(empresaId: string, query: QueryClientesDto): Promise<{
        data: {
            empresaId: string;
            email: string | null;
            id: string;
            nombre: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            telefono: string | null;
            esFrecuente: boolean;
            presupuestoEstimado: Prisma.Decimal | null;
            talleP: string | null;
            colorPreferido: string | null;
            marcaPreferida: string | null;
            metodoPagoPreferido: string | null;
            notasIA: string | null;
            canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    obtener(empresaId: string, id: string): Promise<{
        etiquetas: ({
            etiqueta: {
                empresaId: string;
                id: string;
                nombre: string;
                color: string | null;
            };
        } & {
            clienteId: string;
            etiquetaId: string;
        })[];
        pedidos: ({
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
        direcciones: {
            id: string;
            calle: string;
            numero: string | null;
            ciudad: string;
            provincia: string | null;
            cp: string | null;
            referencia: string | null;
            esPrincipal: boolean;
            clienteId: string;
        }[];
    } & {
        empresaId: string;
        email: string | null;
        id: string;
        nombre: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        telefono: string | null;
        esFrecuente: boolean;
        presupuestoEstimado: Prisma.Decimal | null;
        talleP: string | null;
        colorPreferido: string | null;
        marcaPreferida: string | null;
        metodoPagoPreferido: string | null;
        notasIA: string | null;
        canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
    }>;
    crear(empresaId: string, dto: CreateClienteDto): Promise<{
        empresaId: string;
        email: string | null;
        id: string;
        nombre: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        telefono: string | null;
        esFrecuente: boolean;
        presupuestoEstimado: Prisma.Decimal | null;
        talleP: string | null;
        colorPreferido: string | null;
        marcaPreferida: string | null;
        metodoPagoPreferido: string | null;
        notasIA: string | null;
        canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
    }>;
    actualizar(empresaId: string, id: string, dto: UpdateClienteDto): Promise<{
        empresaId: string;
        email: string | null;
        id: string;
        nombre: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        telefono: string | null;
        esFrecuente: boolean;
        presupuestoEstimado: Prisma.Decimal | null;
        talleP: string | null;
        colorPreferido: string | null;
        marcaPreferida: string | null;
        metodoPagoPreferido: string | null;
        notasIA: string | null;
        canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
    }>;
    agregarDireccion(empresaId: string, clienteId: string, dto: CreateDireccionDto): Promise<{
        id: string;
        calle: string;
        numero: string | null;
        ciudad: string;
        provincia: string | null;
        cp: string | null;
        referencia: string | null;
        esPrincipal: boolean;
        clienteId: string;
    }>;
    historial(empresaId: string, clienteId: string, query: QueryHistorialDto): Promise<{
        data: {
            id: string;
            createdAt: Date;
            descripcion: string | null;
            tipo: string;
            clienteId: string;
            referenciaId: string | null;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    private buscarOFallar;
}
