import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthenticatedUser {
  userId: string;
  empresaId: string;
  email: string;
  rol: 'OWNER' | 'ADMIN' | 'AGENTE';
}

/**
 * Extrae el usuario autenticado (payload del JWT) directamente como
 * parámetro del controller.
 * Uso: async misPedidos(@CurrentUser() user: AuthenticatedUser) {}
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;
    return data ? user?.[data] : user;
  },
);
