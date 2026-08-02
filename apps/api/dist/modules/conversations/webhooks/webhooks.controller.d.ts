import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { WebhooksService } from './webhooks.service';
export declare class WebhooksController {
    private readonly webhooksService;
    private readonly configService;
    constructor(webhooksService: WebhooksService, configService: ConfigService);
    whatsapp(body: any, apikey?: string, tokenQuery?: string): Promise<{
        received: boolean;
    }>;
    verificarInstagram(query: Record<string, string>, res: Response): void;
    instagram(body: any): Promise<{
        received: boolean;
    }>;
}
