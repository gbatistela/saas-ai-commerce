import { EstadoReclamo, PrioridadReclamo } from '@prisma/client';
export declare class UpdateReclamoDto {
    estado?: EstadoReclamo;
    prioridad?: PrioridadReclamo;
    asignadoAId?: string;
}
