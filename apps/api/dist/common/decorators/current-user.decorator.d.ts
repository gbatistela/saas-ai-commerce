export interface AuthenticatedUser {
    userId: string;
    empresaId: string;
    email: string;
    rol: 'OWNER' | 'ADMIN' | 'AGENTE';
}
export declare const CurrentUser: (...dataOrPipes: (keyof AuthenticatedUser | import("@nestjs/common").PipeTransform<any, any> | import("@nestjs/common").Type<import("@nestjs/common").PipeTransform<any, any>> | undefined)[]) => ParameterDecorator;
