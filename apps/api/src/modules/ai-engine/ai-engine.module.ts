import { Module } from '@nestjs/common';
import { ProductosModule } from '../catalog/productos/productos.module';
import { CarritosModule } from '../sales/carritos/carritos.module';
import { PedidosModule } from '../sales/pedidos/pedidos.module';
import { ReclamosModule } from '../support/reclamos/reclamos.module';
import { ConversacionesModule } from '../conversations/conversaciones/conversaciones.module';
import { AI_PROVIDER } from './providers/ai-provider.interface';
import { OpenaiProvider } from './providers/openai.provider';
import { ContextBuilderService } from './context/context-builder.service';
import { PromptAssemblerService } from './prompts/prompt-assembler.service';
import { FunctionExecutorService } from './functions/function-executor.service';
import { MemoryUpdaterService } from './memory/memory-updater.service';
import { ConversationOrchestratorService } from './orchestrator/conversation-orchestrator.service';
import { ProcessMessageProcessor } from './processors/process-message.processor';
import { AiTestService } from './test/ai-test.service';
import { AiTestController } from './test/ai-test.controller';

@Module({
  imports: [
    ProductosModule,
    CarritosModule,
    PedidosModule,
    ReclamosModule,
    ConversacionesModule,
  ],
  controllers: [AiTestController],
  providers: [
    { provide: AI_PROVIDER, useClass: OpenaiProvider },
    ContextBuilderService,
    PromptAssemblerService,
    FunctionExecutorService,
    MemoryUpdaterService,
    ConversationOrchestratorService,
    ProcessMessageProcessor,
    AiTestService,
  ],
})
export class AiEngineModule {}
