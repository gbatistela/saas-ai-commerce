"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProcessMessageProcessor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessMessageProcessor = void 0;
const bullmq_1 = require("@nestjs/bullmq");
const common_1 = require("@nestjs/common");
const queue_constants_1 = require("../../../infra/queue/queue.constants");
const conversation_orchestrator_service_1 = require("../orchestrator/conversation-orchestrator.service");
let ProcessMessageProcessor = ProcessMessageProcessor_1 = class ProcessMessageProcessor extends bullmq_1.WorkerHost {
    constructor(orchestrator) {
        super();
        this.orchestrator = orchestrator;
        this.logger = new common_1.Logger(ProcessMessageProcessor_1.name);
    }
    async process(job) {
        try {
            await this.orchestrator.handle(job.data);
        }
        catch (error) {
            this.logger.error(`Error procesando mensaje ${job.data.mensajeId}: ${error?.message ?? error}`, error?.stack);
            throw error;
        }
    }
};
exports.ProcessMessageProcessor = ProcessMessageProcessor;
exports.ProcessMessageProcessor = ProcessMessageProcessor = ProcessMessageProcessor_1 = __decorate([
    (0, bullmq_1.Processor)(queue_constants_1.PROCESS_MESSAGE_QUEUE),
    __metadata("design:paramtypes", [conversation_orchestrator_service_1.ConversationOrchestratorService])
], ProcessMessageProcessor);
//# sourceMappingURL=process-message.processor.js.map