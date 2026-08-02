import { EstadoPedidoEnum } from '@prisma/client';
export declare class ActualizarEstadoPedidoDto {
    estado: EstadoPedidoEnum;
    comentario?: string;
}
