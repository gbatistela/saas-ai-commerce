declare const CAMPOS_ORDENABLES: readonly ["nombre", "precio", "createdAt"];
export declare class QueryProductosDto {
    categoria?: string;
    marca?: string;
    texto?: string;
    estado?: 'ACTIVO' | 'INACTIVO' | 'SUSPENDIDO';
    page?: number;
    limit?: number;
    sort?: (typeof CAMPOS_ORDENABLES)[number];
    order?: 'asc' | 'desc';
}
export {};
