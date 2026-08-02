import { TipoMensaje } from '@prisma/client';
export declare class CreateMensajeDto {
    contenido: string;
    tipo?: TipoMensaje;
}
