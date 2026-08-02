export type AiRole = 'system' | 'user' | 'assistant' | 'tool';

export interface AiToolCall {
  id: string;
  name: string;
  /** JSON string tal cual lo devuelve el modelo (todavía sin parsear). */
  arguments: string;
}

export interface AiMensaje {
  role: AiRole;
  content: string | null;
  /** Solo para role='tool': a qué tool_call responde. */
  toolCallId?: string;
  /** Solo para role='assistant' cuando decidió llamar funciones. */
  toolCalls?: AiToolCall[];
}

export interface AiFunctionDefinition {
  name: string;
  description: string;
  /** JSON Schema de los parámetros (formato OpenAI function calling). */
  parameters: Record<string, unknown>;
}

export interface AiRespuesta {
  contenido: string | null;
  toolCalls: AiToolCall[];
  tokensPrompt: number;
  tokensCompletion: number;
  modelo: string;
}

/**
 * Puerto que aísla al resto del AI Engine del proveedor concreto
 * (OpenAI hoy; permite agregar Claude/Gemini como otra implementación
 * sin tocar orchestrator/context/functions).
 */
export interface IAiProvider {
  generarRespuesta(params: {
    mensajes: AiMensaje[];
    funciones: AiFunctionDefinition[];
    modelo: string;
    temperature: number;
    maxTokens: number;
  }): Promise<AiRespuesta>;

  /** Reservado para RAG (Fase 2, tabla Embedding). No usado todavía en el MVP. */
  generarEmbedding(texto: string): Promise<number[]>;
}

export const AI_PROVIDER = Symbol('AI_PROVIDER');
