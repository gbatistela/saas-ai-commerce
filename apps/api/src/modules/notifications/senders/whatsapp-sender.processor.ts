import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Job } from 'bullmq';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { SEND_MESSAGE_QUEUE } from '../../../infra/queue/queue.constants';

interface SendMessageJobData {
  empresaId: string;
  conversacionId: string;
  mensajeId: string;
  clienteId: string;
  canal: string;
  contenido: string | null;
}

/**
 * Consume la cola `send-message` (encolada por Conversations y el AI
 * Engine) y hace la entrega real por el canal correspondiente. Por ahora
 * solo WhatsApp vía Evolution API; Instagram (Meta Send API) queda
 * pendiente — se ignora sin romper el job.
 */
@Processor(SEND_MESSAGE_QUEUE)
export class WhatsappSenderProcessor extends WorkerHost {
  private readonly logger = new Logger(WhatsappSenderProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job<SendMessageJobData>): Promise<void> {
    const { empresaId, clienteId, canal, contenido } = job.data;

    if (canal !== 'WHATSAPP') {
      this.logger.log(`Canal ${canal} todavía no tiene envío saliente implementado, se omite`);
      return;
    }

    if (!contenido) return;

    const [empresa, cliente] = await Promise.all([
      this.prisma.empresa.findUnique({ where: { id: empresaId } }),
      this.prisma.cliente.findUnique({ where: { id: clienteId } }),
    ]);

    if (!empresa || !cliente?.telefono || cliente.telefono.startsWith('web:')) {
      this.logger.warn(`No se pudo resolver destinatario de WhatsApp para el job ${job.id}`);
      return;
    }

    const numero = cliente.telefono.replace(/\D/g, '');
    const apiUrl = this.configService.get<string>('channels.evolutionApiUrl');
    const apiKey = this.configService.get<string>('channels.evolutionApiKey');

    if (!apiUrl || !apiKey) {
      this.logger.warn('EVOLUTION_API_URL/EVOLUTION_API_KEY no configurados, no se puede enviar');
      return;
    }

    const res = await fetch(`${apiUrl}/message/sendText/${empresa.slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: apiKey },
      body: JSON.stringify({ number: numero, text: contenido }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Evolution API respondió ${res.status} al enviar: ${body}`);
    }
  }
}
