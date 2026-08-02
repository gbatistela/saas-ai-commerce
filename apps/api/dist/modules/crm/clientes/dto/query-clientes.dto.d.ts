declare const CAMPOS_ORDENABLES: readonly ["nombre", "createdAt"];
export declare class QueryClientesDto {
    nombre?: string;
    telefono?: string;
    esFrecuente?: string;
    page?: number;
    limit?: number;
    sort?: (typeof CAMPOS_ORDENABLES)[number];
    order?: 'asc' | 'desc';
}
export {};
