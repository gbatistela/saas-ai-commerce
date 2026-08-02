import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import {
  AiFunctionDefinition,
  AiMensaje,
  AiRespuesta,
  IAiProvider,
} from './ai-provider.interface';

@Injectable()
export class OpenaiProvider implements IAiProvider {
  private readonly client: OpenAI;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('openai.apiKey'),
    });
  }

  async generarRespuesta(params: {
    mensajes: AiMensaje[];
    funciones: AiFunctionDefinition[];
    modelo: string;
    temperature: number;
    maxTokens: number;
  }): Promise<AiRespuesta> {
    const completion = await this.client.chat.completions.create({
      model: params.modelo,
      temperature: params.temperature,
      max_tokens: params.maxTokens,
      messages: params.mensajes.map(mapearMensaje),
      ...(params.funciones.length
        ? {
            tools: params.funciones.map((f) => ({
              type: 'function' as const,
              function: {
                name: f.name,
                description: f.description,
                parameters: f.parameters,
              },
            })),
          }
        : {}),
    });

    const choice = completion.choices[0];
    const toolCalls = (choice.message.tool_calls ?? [])
      .filter((tc): tc is typeof tc & { type: 'function' } => tc.type === 'function')
      .map((tc) => ({
        id: tc.id,
        name: tc.function.name,
        arguments: tc.function.arguments,
      }));

    return {
      contenido: choice.message.content,
      toolCalls,
      tokensPrompt: completion.usage?.prompt_tokens ?? 0,
      tokensCompletion: completion.usage?.completion_tokens ?? 0,
      modelo: completion.model,
    };
  }

  async generarEmbedding(texto: string): Promise<number[]> {
    const respuesta = await this.client.embeddings.create({
      model: 'text-embedding-3-small',
      input: texto,
    });
    return respuesta.data[0].embedding;
  }
}

function mapearMensaje(m: AiMensaje): ChatCompletionMessageParam {
  if (m.role === 'tool') {
    return {
      role: 'tool',
      tool_call_id: m.toolCallId ?? '',
      content: m.content ?? '',
    };
  }

  if (m.role === 'assistant' && m.toolCalls?.length) {
    return {
      role: 'assistant',
      content: m.content,
      tool_calls: m.toolCalls.map((tc) => ({
        id: tc.id,
        type: 'function' as const,
        function: { name: tc.name, arguments: tc.arguments },
      })),
    };
  }

  return { role: m.role as 'system' | 'user' | 'assistant', content: m.content ?? '' };
}
