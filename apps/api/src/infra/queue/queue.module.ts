import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { PROCESS_MESSAGE_QUEUE, SEND_MESSAGE_QUEUE } from './queue.constants';

/**
 * Módulo global: expone BullModule (colas ya registradas) para que
 * cualquier módulo pueda inyectar @InjectQueue(...) sin volver a
 * declarar la conexión.
 */
@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: new Redis(config.get<string>('redis.url')!, {
          // Requerido por BullMQ: los comandos bloqueantes de las colas
          // no funcionan si ioredis reintenta con un límite finito.
          maxRetriesPerRequest: null,
        }),
      }),
    }),
    BullModule.registerQueue(
      {
        name: PROCESS_MESSAGE_QUEUE,
        defaultJobOptions: {
          // docs/architecture/05-ai-engine.md §7: 1 reintento automático
          // si falla la llamada a OpenAI (timeout, rate limit, etc.).
          attempts: 2,
          backoff: { type: 'fixed', delay: 5000 },
          removeOnComplete: 1000,
          removeOnFail: 5000,
        },
      },
      { name: SEND_MESSAGE_QUEUE },
    ),
  ],
  exports: [BullModule],
})
export class QueueModule {}
