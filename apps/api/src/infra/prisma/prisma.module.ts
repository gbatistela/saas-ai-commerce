import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo global: PrismaService queda disponible para inyectar en
 * cualquier módulo de la app sin necesidad de importarlo cada vez.
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
