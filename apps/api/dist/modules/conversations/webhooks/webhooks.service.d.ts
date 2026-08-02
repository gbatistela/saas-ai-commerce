import { Queue } from 'bullmq';
import { PrismaService } from '../../../infra/prisma/prisma.service';
export declare class WebhooksService {
    private readonly prisma;
    private readonly processMessageQueue;
    private readonly logger;
    constructor(prisma: PrismaService, processMessageQueue: Queue);
    procesarWhatsapp(body: any): Promise<void>;
    procesarInstagram(body: any): Promise<void>;
    verificarHandshakeInstagram(query: Record<string, string>, verifyToken: string): string | null;
    private ingresarMensaje;
    private extraerMensajeWhatsapp;
}
