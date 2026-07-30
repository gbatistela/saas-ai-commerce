import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca un endpoint como público (sin requerir JWT).
 * Uso: @Public()  arriba del método del controller.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
