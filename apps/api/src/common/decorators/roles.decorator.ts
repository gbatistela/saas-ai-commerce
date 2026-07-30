import { SetMetadata } from '@nestjs/common';

export type RolUsuario = 'OWNER' | 'ADMIN' | 'AGENTE';

export const ROLES_KEY = 'roles';

/**
 * Restringe un endpoint a los roles indicados.
 * Uso: @Roles('OWNER', 'ADMIN')
 */
export const Roles = (...roles: RolUsuario[]) => SetMetadata(ROLES_KEY, roles);
