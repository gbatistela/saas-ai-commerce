import { EstadoPedidoEnum } from '@prisma/client';
export declare class QueryPedidosDto {
    estado?: EstadoPedidoEnum;
    cliente?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    page?: number;
    limit?: number;
}
