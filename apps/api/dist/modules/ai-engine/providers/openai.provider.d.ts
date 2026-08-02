import { ConfigService } from '@nestjs/config';
import { AiFunctionDefinition, AiMensaje, AiRespuesta, IAiProvider } from './ai-provider.interface';
export declare class OpenaiProvider implements IAiProvider {
    private readonly configService;
    private readonly client;
    constructor(configService: ConfigService);
    generarRespuesta(params: {
        mensajes: AiMensaje[];
        funciones: AiFunctionDefinition[];
        modelo: string;
        temperature: number;
        maxTokens: number;
    }): Promise<AiRespuesta>;
    generarEmbedding(texto: string): Promise<number[]>;
}
