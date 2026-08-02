import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PROCESS_MESSAGE_QUEUE } from '../../../infra/queue/queue.constants';
import {
  ConversationOrchestratorService,
  ProcessMessageJobData,
} from '../orchestrator/conversation-orchestrator.service';

@Processor(PROCESS_MESSAGE_QUEUE)
export class ProcessMessageProcessor extends WorkerHost {
  private readonly logger = new Logger(ProcessMessageProcessor.name);

  constructor(private readonly orchestrator: ConversationOrchestratorService) {
    super();
  }

  async process(job: Job<ProcessMessageJobData>): Promise<void> {
    try {
      await this.orchestrator.handle(job.data);
    } catch (error) {
      this.logger.error(
        `Error procesando mensaje ${job.data.mensajeId}: ${(error as Error)?.message ?? error}`,
        (error as Error)?.stack,
      );
      // Se relanza para que BullMQ aplique el reintento configurado en
      // QueueModule (attempts: 2) en vez de perder el job silenciosamente.
      throw error;
    }
  }
}
