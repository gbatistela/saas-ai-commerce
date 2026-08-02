import { PrioridadReclamo } from '@prisma/client';
export declare class CreateReclamoDto {
    clienteId: string;
    pedidoId?: string;
    tipo: string;
    descripcion: string;
    prioridad?: PrioridadReclamo;
}
