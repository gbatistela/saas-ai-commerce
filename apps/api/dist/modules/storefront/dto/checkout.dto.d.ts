export declare class DireccionCheckoutDto {
    calle: string;
    numero?: string;
    ciudad: string;
    provincia?: string;
    cp?: string;
    referencia?: string;
}
export declare class CheckoutStorefrontDto {
    sessionId: string;
    nombre: string;
    telefono: string;
    email?: string;
    direccion?: DireccionCheckoutDto;
}
