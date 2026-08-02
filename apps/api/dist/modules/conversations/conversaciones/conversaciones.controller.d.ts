import { ConversacionesService } from './conversaciones.service';
import { QueryConversacionesDto } from './dto/query-conversaciones.dto';
import { QueryMensajesDto } from './dto/query-mensajes.dto';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { AsignarConversacionDto } from './dto/asignar-conversacion.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class ConversacionesController {
    private readonly conversacionesService;
    constructor(conversacionesService: ConversacionesService);
    listar(user: AuthenticatedUser, query: QueryConversacionesDto): Promise<{
        data: ({
            cliente: {
                id: string;
                nombre: string | null;
                telefono: string | null;
            };
            mensajes: {
                contenido: string | null;
                emisor: import(".prisma/client").$Enums.EmisorMensaje;
            }[];
            asignadoA: {
                id: string;
                nombre: string;
            } | null;
        } & {
            empresaId: string;
            id: string;
            estado: import(".prisma/client").$Enums.EstadoConversacion;
            createdAt: Date;
            updatedAt: Date;
            clienteId: string;
            canal: import(".prisma/client").$Enums.CanalOrigen;
            asignadoAId: string | null;
            ultimoMensajeAt: Date | null;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    obtener(user: AuthenticatedUser, id: string, query: QueryMensajesDto): Promise<{
        mensajes: {
            data: ({
                archivo: {
                    empresaId: string;
                    id: string;
                    createdAt: Date;
                    url: string;
                    tipoMime: string;
                    tamanoBytes: number | null;
                    bucket: string | null;
                } | null;
            } & {
                id: string;
                createdAt: Date;
                contenido: string | null;
                tipo: import(".prisma/client").$Enums.TipoMensaje;
                archivoId: string | null;
                conversacionId: string;
                emisor: import(".prisma/client").$Enums.EmisorMensaje;
                tokensUsados: number | null;
                costoUsd: import("@prisma/client/runtime/library").Decimal | null;
                intencionDetectada: string | null;
                sentimiento: string | null;
            })[];
            meta: {
                page: number;
                limit: number;
                total: number;
                totalPages: number;
            };
        };
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoConversacion;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        canal: import(".prisma/client").$Enums.CanalOrigen;
        asignadoAId: string | null;
        ultimoMensajeAt: Date | null;
    }>;
    enviarMensaje(user: AuthenticatedUser, id: string, dto: CreateMensajeDto): Promise<{
        id: string;
        createdAt: Date;
        contenido: string | null;
        tipo: import(".prisma/client").$Enums.TipoMensaje;
        archivoId: string | null;
        conversacionId: string;
        emisor: import(".prisma/client").$Enums.EmisorMensaje;
        tokensUsados: number | null;
        costoUsd: import("@prisma/client/runtime/library").Decimal | null;
        intencionDetectada: string | null;
        sentimiento: string | null;
    }>;
    asignar(user: AuthenticatedUser, id: string, dto: AsignarConversacionDto): Promise<{
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoConversacion;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        canal: import(".prisma/client").$Enums.CanalOrigen;
        asignadoAId: string | null;
        ultimoMensajeAt: Date | null;
    }>;
    actualizarEstado(user: AuthenticatedUser, id: string, dto: ActualizarEstadoDto): Promise<{
        empresaId: string;
        id: string;
        estado: import(".prisma/client").$Enums.EstadoConversacion;
        createdAt: Date;
        updatedAt: Date;
        clienteId: string;
        canal: import(".prisma/client").$Enums.CanalOrigen;
        asignadoAId: string | null;
        ultimoMensajeAt: Date | null;
    }>;
}
