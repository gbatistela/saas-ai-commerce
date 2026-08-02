import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { QueryReclamosDto } from './dto/query-reclamos.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import { CreateArchivoReclamoDto } from './dto/create-archivo-reclamo.dto';
export declare class ReclamosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    crear(empresaId: string, dto: CreateReclamoDto): Promise<{
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
    listar(empresaId: string, query: QueryReclamosDto): Promise<{
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
    obtener(empresaId: string, id: string): Promise<{
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
    actualizar(empresaId: string, id: string, dto: UpdateReclamoDto): Promise<{
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
    agregarArchivo(empresaId: string, id: string, dto: CreateArchivoReclamoDto): Promise<{
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
        tipo: import(".prisma/client").$Enums.TipoMensaje;
        archivoId: string;
        reclamoId: string;
    }>;
    private buscarOFallar;
}
