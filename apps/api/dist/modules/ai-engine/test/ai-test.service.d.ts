import { PrismaService } from '../../../infra/prisma/prisma.service';
import { IAiProvider } from '../providers/ai-provider.interface';
import { PromptAssemblerService } from '../prompts/prompt-assembler.service';
export interface MensajePrueba {
    emisor: 'CLIENTE' | 'IA';
    contenido: string;
}
export declare class AiTestService {
    private readonly prisma;
    private readonly aiProvider;
    private readonly promptAssembler;
    constructor(prisma: PrismaService, aiProvider: IAiProvider, promptAssembler: PromptAssemblerService);
    probar(empresaId: string, historial: MensajePrueba[]): Promise<string>;
    private clienteSintetico;
    private mensajeSintetico;
}
