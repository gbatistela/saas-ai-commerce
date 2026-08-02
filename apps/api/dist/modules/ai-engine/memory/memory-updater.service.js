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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MemoryUpdaterService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryUpdaterService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const ai_provider_interface_1 = require("../providers/ai-provider.interface");
const CAMPOS_VALIDOS = [
    'talleP',
    'colorPreferido',
    'marcaPreferida',
    'presupuestoEstimado',
    'metodoPagoPreferido',
    'notasIA',
];
const PROMPT_EXTRACCION = `Analizá este intercambio entre un cliente y un asesor de ventas.
Si el cliente mencionó explícitamente alguna preferencia NUEVA, devolvé un JSON
con SOLO los campos detectados (no inventes ni completes campos no mencionados):
{"talleP": string, "colorPreferido": string, "marcaPreferida": string, "presupuestoEstimado": number, "metodoPagoPreferido": string, "notasIA": string}
"notasIA" es para una nota corta y útil que no encaje en los otros campos.
Si no detectaste nada nuevo, devolvé {}.
Respondé ÚNICAMENTE con el JSON, sin texto adicional ni bloques de código.`;
let MemoryUpdaterService = MemoryUpdaterService_1 = class MemoryUpdaterService {
    constructor(prisma, aiProvider) {
        this.prisma = prisma;
        this.aiProvider = aiProvider;
        this.logger = new common_1.Logger(MemoryUpdaterService_1.name);
    }
    actualizar(clienteId, mensajeCliente, respuestaIA) {
        this.ejecutar(clienteId, mensajeCliente, respuestaIA).catch((error) => {
            this.logger.warn(`No se pudo actualizar la memoria del cliente ${clienteId}: ${error?.message ?? error}`);
        });
    }
    async ejecutar(clienteId, mensajeCliente, respuestaIA) {
        const respuesta = await this.aiProvider.generarRespuesta({
            mensajes: [
                {
                    role: 'system',
                    content: `${PROMPT_EXTRACCION}\n\nCliente: "${mensajeCliente}"\nAsesor: "${respuestaIA}"`,
                },
            ],
            funciones: [],
            modelo: 'gpt-4o-mini',
            temperature: 0,
            maxTokens: 200,
        });
        const detectado = this.parsearJson(respuesta.contenido);
        if (!detectado)
            return;
        const data = {};
        for (const campo of CAMPOS_VALIDOS) {
            const valor = detectado[campo];
            if (valor !== undefined && valor !== null && valor !== '') {
                data[campo] = valor;
            }
        }
        if (Object.keys(data).length === 0)
            return;
        await this.prisma.cliente.update({ where: { id: clienteId }, data });
    }
    parsearJson(contenido) {
        if (!contenido)
            return null;
        try {
            const limpio = contenido.replace(/```json|```/g, '').trim();
            const parseado = JSON.parse(limpio);
            return typeof parseado === 'object' && parseado !== null ? parseado : null;
        }
        catch {
            return null;
        }
    }
};
exports.MemoryUpdaterService = MemoryUpdaterService;
exports.MemoryUpdaterService = MemoryUpdaterService = MemoryUpdaterService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(ai_provider_interface_1.AI_PROVIDER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], MemoryUpdaterService);
//# sourceMappingURL=memory-updater.service.js.map