import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { ConversationOrchestratorService, ProcessMessageJobData } from '../orchestrator/conversation-orchestrator.service';
export declare class ProcessMessageProcessor extends WorkerHost {
    private readonly orchestrator;
    private readonly logger;
    constructor(orchestrator: ConversationOrchestratorService);
    process(job: Job<ProcessMessageJobData>): Promise<void>;
}
