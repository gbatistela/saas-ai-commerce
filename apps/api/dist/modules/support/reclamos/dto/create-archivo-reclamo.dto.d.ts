import { TipoMensaje } from '@prisma/client';
export declare class CreateArchivoReclamoDto {
    url: string;
    tipoMime: string;
    tamanoBytes?: number;
    bucket?: string;
    tipo: TipoMensaje;
}
