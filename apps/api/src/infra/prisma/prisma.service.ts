import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Wrapper de PrismaClient como servicio inyectable de Nest.
 * Maneja el ciclo de vida de la conexión (connect/disconnect) junto
 * con el ciclo de vida de la aplicación.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log:
        process.env.NODE_ENV === 'development'
          ? ['warn', 'error']
          : ['error'],
    });
  }

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Conexión a la base de datos establecida');
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
