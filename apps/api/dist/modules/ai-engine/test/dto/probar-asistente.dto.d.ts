export declare class MensajePruebaDto {
    emisor: 'CLIENTE' | 'IA';
    contenido: string;
}
export declare class ProbarAsistenteDto {
    mensaje: string;
    historial?: MensajePruebaDto[];
}
