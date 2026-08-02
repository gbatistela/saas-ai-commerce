import { CanalOrigen, EstadoConversacion } from '@prisma/client';
export declare class QueryConversacionesDto {
    estado?: EstadoConversacion;
    canal?: CanalOrigen;
    asignadoA?: string;
    cliente?: string;
    page?: number;
    limit?: number;
}
