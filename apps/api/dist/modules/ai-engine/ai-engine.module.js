"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiEngineModule = void 0;
const common_1 = require("@nestjs/common");
const productos_module_1 = require("../catalog/productos/productos.module");
const carritos_module_1 = require("../sales/carritos/carritos.module");
const pedidos_module_1 = require("../sales/pedidos/pedidos.module");
const reclamos_module_1 = require("../support/reclamos/reclamos.module");
const conversaciones_module_1 = require("../conversations/conversaciones/conversaciones.module");
const ai_provider_interface_1 = require("./providers/ai-provider.interface");
const openai_provider_1 = require("./providers/openai.provider");
const context_builder_service_1 = require("./context/context-builder.service");
const prompt_assembler_service_1 = require("./prompts/prompt-assembler.service");
const function_executor_service_1 = require("./functions/function-executor.service");
const memory_updater_service_1 = require("./memory/memory-updater.service");
const conversation_orchestrator_service_1 = require("./orchestrator/conversation-orchestrator.service");
const process_message_processor_1 = require("./processors/process-message.processor");
const ai_test_service_1 = require("./test/ai-test.service");
const ai_test_controller_1 = require("./test/ai-test.controller");
let AiEngineModule = class AiEngineModule {
};
exports.AiEngineModule = AiEngineModule;
exports.AiEngineModule = AiEngineModule = __decorate([
    (0, common_1.Module)({
        imports: [
            productos_module_1.ProductosModule,
            carritos_module_1.CarritosModule,
            pedidos_module_1.PedidosModule,
            reclamos_module_1.ReclamosModule,
            conversaciones_module_1.ConversacionesModule,
        ],
        controllers: [ai_test_controller_1.AiTestController],
        providers: [
            { provide: ai_provider_interface_1.AI_PROVIDER, useClass: openai_provider_1.OpenaiProvider },
            context_builder_service_1.ContextBuilderService,
            prompt_assembler_service_1.PromptAssemblerService,
            function_executor_service_1.FunctionExecutorService,
            memory_updater_service_1.MemoryUpdaterService,
            conversation_orchestrator_service_1.ConversationOrchestratorService,
            process_message_processor_1.ProcessMessageProcessor,
            ai_test_service_1.AiTestService,
        ],
    })
], AiEngineModule);
//# sourceMappingURL=ai-engine.module.js.map