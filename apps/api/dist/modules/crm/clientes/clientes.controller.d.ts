import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClientesDto } from './dto/query-clientes.dto';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { QueryHistorialDto } from './dto/query-historial.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class ClientesController {
    private readonly clientesService;
    constructor(clientesService: ClientesService);
    listar(user: AuthenticatedUser, query: QueryClientesDto): Promise<{
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
            presupuestoEstimado: import("@prisma/client/runtime/library").Decimal | null;
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
    obtener(user: AuthenticatedUser, id: string): Promise<{
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
        presupuestoEstimado: import("@prisma/client/runtime/library").Decimal | null;
        talleP: string | null;
        colorPreferido: string | null;
        marcaPreferida: string | null;
        metodoPagoPreferido: string | null;
        notasIA: string | null;
        canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
    }>;
    crear(user: AuthenticatedUser, dto: CreateClienteDto): Promise<{
        empresaId: string;
        email: string | null;
        id: string;
        nombre: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        telefono: string | null;
        esFrecuente: boolean;
        presupuestoEstimado: import("@prisma/client/runtime/library").Decimal | null;
        talleP: string | null;
        colorPreferido: string | null;
        marcaPreferida: string | null;
        metodoPagoPreferido: string | null;
        notasIA: string | null;
        canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
    }>;
    actualizar(user: AuthenticatedUser, id: string, dto: UpdateClienteDto): Promise<{
        empresaId: string;
        email: string | null;
        id: string;
        nombre: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        telefono: string | null;
        esFrecuente: boolean;
        presupuestoEstimado: import("@prisma/client/runtime/library").Decimal | null;
        talleP: string | null;
        colorPreferido: string | null;
        marcaPreferida: string | null;
        metodoPagoPreferido: string | null;
        notasIA: string | null;
        canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
    }>;
    agregarDireccion(user: AuthenticatedUser, id: string, dto: CreateDireccionDto): Promise<{
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
    historial(user: AuthenticatedUser, id: string, query: QueryHistorialDto): Promise<{
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
}
