import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolUsuario } from '../decorators/roles.decorator';
import { AuthenticatedUser } from '../decorators/current-user.decorator';

/**
 * Guard global. Si el endpoint no tiene @Roles(), no restringe nada
 * (cualquier usuario autenticado pasa). Si tiene @Roles(...), solo
 * deja pasar a los usuarios cuyo rol esté en la lista.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const rolesPermitidos = this.reflector.getAllAndOverride<RolUsuario[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!rolesPermitidos || rolesPermitidos.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;

    if (!user) return false;

    return rolesPermitidos.includes(user.rol);
  }
}
