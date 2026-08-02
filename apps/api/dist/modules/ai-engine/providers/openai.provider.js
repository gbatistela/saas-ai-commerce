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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenaiProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const openai_1 = require("openai");
let OpenaiProvider = class OpenaiProvider {
    constructor(configService) {
        this.configService = configService;
        this.client = new openai_1.default({
            apiKey: this.configService.get('openai.apiKey'),
        });
    }
    async generarRespuesta(params) {
        const completion = await this.client.chat.completions.create({
            model: params.modelo,
            temperature: params.temperature,
            max_tokens: params.maxTokens,
            messages: params.mensajes.map(mapearMensaje),
            ...(params.funciones.length
                ? {
                    tools: params.funciones.map((f) => ({
                        type: 'function',
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
            .filter((tc) => tc.type === 'function')
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
    async generarEmbedding(texto) {
        const respuesta = await this.client.embeddings.create({
            model: 'text-embedding-3-small',
            input: texto,
        });
        return respuesta.data[0].embedding;
    }
};
exports.OpenaiProvider = OpenaiProvider;
exports.OpenaiProvider = OpenaiProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], OpenaiProvider);
function mapearMensaje(m) {
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
                type: 'function',
                function: { name: tc.name, arguments: tc.arguments },
            })),
        };
    }
    return { role: m.role, content: m.content ?? '' };
}
//# sourceMappingURL=openai.provider.js.map