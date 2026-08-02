import { TipoArchivoProducto } from '@prisma/client';
export declare class CreateArchivoProductoDto {
    url: string;
    tipoMime: string;
    tamanoBytes?: number;
    bucket?: string;
    tipo: TipoArchivoProducto;
    orden?: number;
}
