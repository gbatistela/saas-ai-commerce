export type AiRole = 'system' | 'user' | 'assistant' | 'tool';
export interface AiToolCall {
    id: string;
    name: string;
    arguments: string;
}
export interface AiMensaje {
    role: AiRole;
    content: string | null;
    toolCallId?: string;
    toolCalls?: AiToolCall[];
}
export interface AiFunctionDefinition {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
}
export interface AiRespuesta {
    contenido: string | null;
    toolCalls: AiToolCall[];
    tokensPrompt: number;
    tokensCompletion: number;
    modelo: string;
}
export interface IAiProvider {
    generarRespuesta(params: {
        mensajes: AiMensaje[];
        funciones: AiFunctionDefinition[];
        modelo: string;
        temperature: number;
        maxTokens: number;
    }): Promise<AiRespuesta>;
    generarEmbedding(texto: string): Promise<number[]>;
}
export declare const AI_PROVIDER: unique symbol;
