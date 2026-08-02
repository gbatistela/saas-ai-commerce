import { Queue } from 'bullmq';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { IAiProvider } from '../providers/ai-provider.interface';
import { ContextBuilderService } from '../context/context-builder.service';
import { PromptAssemblerService } from '../prompts/prompt-assembler.service';
import { FunctionExecutorService } from '../functions/function-executor.service';
import { MemoryUpdaterService } from '../memory/memory-updater.service';
export interface ProcessMessageJobData {
    empresaId: string;
    conversacionId: string;
    mensajeId: string;
    clienteId: string;
    canal: string;
}
export declare class ConversationOrchestratorService {
    private readonly prisma;
    private readonly aiProvider;
    private readonly contextBuilder;
    private readonly promptAssembler;
    private readonly functionExecutor;
    private readonly memoryUpdater;
    private readonly sendMessageQueue;
    private readonly logger;
    constructor(prisma: PrismaService, aiProvider: IAiProvider, contextBuilder: ContextBuilderService, promptAssembler: PromptAssemblerService, functionExecutor: FunctionExecutorService, memoryUpdater: MemoryUpdaterService, sendMessageQueue: Queue);
    handle(job: ProcessMessageJobData): Promise<void>;
    private parsearArgumentos;
}
