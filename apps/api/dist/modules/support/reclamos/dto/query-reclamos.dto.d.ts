import { EstadoReclamo, PrioridadReclamo } from '@prisma/client';
export declare class QueryReclamosDto {
    estado?: EstadoReclamo;
    prioridad?: PrioridadReclamo;
    asignadoA?: string;
    cliente?: string;
    page?: number;
    limit?: number;
}
