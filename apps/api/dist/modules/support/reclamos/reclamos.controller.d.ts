import { ReclamosService } from './reclamos.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { QueryReclamosDto } from './dto/query-reclamos.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import { CreateArchivoReclamoDto } from './dto/create-archivo-reclamo.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class ReclamosController {
    private readonly reclamosService;
    constructor(reclamosService: ReclamosService);
    crear(user: AuthenticatedUser, dto: CreateReclamoDto): Promise<{
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReclamo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string;
        tipo: string;
        clienteId: string;
        pedidoId: string | null;
        asignadoAId: string | null;
        prioridad: import(".prisma/client").$Enums.PrioridadReclamo;
    }>;
    listar(user: AuthenticatedUser, query: QueryReclamosDto): Promise<{
        data: ({
            cliente: {
                id: string;
                nombre: string | null;
                telefono: string | null;
            };
        } & {
            empresaId: string;
            id: string;
            estado: import(".prisma/client").$Enums.EstadoReclamo;
            createdAt: Date;
            updatedAt: Date;
            descripcion: string;
            tipo: string;
            clienteId: string;
            pedidoId: string | null;
            asignadoAId: string | null;
            prioridad: import(".prisma/client").$Enums.PrioridadReclamo;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    obtener(user: AuthenticatedUser, id: string): Promise<{
        cliente: {
            id: string;
            nombre: string | null;
            telefono: string | null;
        };
        pedido: {
            id: string;
            numeroPedido: string;
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
            tipo: import(".prisma/client").$Enums.TipoMensaje;
            archivoId: string;
            reclamoId: string;
        })[];
    } & {
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReclamo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string;
        tipo: string;
        clienteId: string;
        pedidoId: string | null;
        asignadoAId: string | null;
        prioridad: import(".prisma/client").$Enums.PrioridadReclamo;
    }>;
    actualizar(user: AuthenticatedUser, id: string, dto: UpdateReclamoDto): Promise<{
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoReclamo;
        createdAt: Date;
        updatedAt: Date;
        descripcion: string;
        tipo: string;
        clienteId: string;
        pedidoId: string | null;
        asignadoAId: string | null;
        prioridad: import(".prisma/client").$Enums.PrioridadReclamo;
    }>;
    agregarArchivo(user: AuthenticatedUser, id: string, dto: CreateArchivoReclamoDto): Promise<{
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
        tipo: import(".prisma/client").$Enums.TipoMensaje;
        archivoId: string;
        reclamoId: string;
    }>;
}
