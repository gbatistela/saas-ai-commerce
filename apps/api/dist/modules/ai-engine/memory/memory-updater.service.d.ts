import { PrismaService } from '../../../infra/prisma/prisma.service';
import { IAiProvider } from '../providers/ai-provider.interface';
export declare class MemoryUpdaterService {
    private readonly prisma;
    private readonly aiProvider;
    private readonly logger;
    constructor(prisma: PrismaService, aiProvider: IAiProvider);
    actualizar(clienteId: string, mensajeCliente: string, respuestaIA: string): void;
    private ejecutar;
    private parsearJson;
}
