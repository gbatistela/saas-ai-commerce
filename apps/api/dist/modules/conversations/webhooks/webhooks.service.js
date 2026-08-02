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
var WebhooksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebhooksService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const queue_constants_1 = require("../../../infra/queue/queue.constants");
let WebhooksService = WebhooksService_1 = class WebhooksService {
    constructor(prisma, processMessageQueue) {
        this.prisma = prisma;
        this.processMessageQueue = processMessageQueue;
        this.logger = new common_1.Logger(WebhooksService_1.name);
    }
    async procesarWhatsapp(body) {
        const evento = this.extraerMensajeWhatsapp(body);
        if (!evento)
            return;
        const empresa = await this.prisma.empresa.findUnique({
            where: { slug: evento.instanceName },
        });
        if (!empresa) {
            this.logger.warn(`Webhook de WhatsApp: no hay empresa con slug de instancia "${evento.instanceName}"`);
            return;
        }
        await this.ingresarMensaje({
            canal: 'WHATSAPP',
            empresaId: empresa.id,
            identificadorCliente: evento.telefono,
            nombreCliente: evento.nombre,
            contenido: evento.contenido,
        });
    }
    async procesarInstagram(body) {
        if (body?.object !== 'instagram')
            return;
        for (const entry of body.entry ?? []) {
            const empresa = await this.prisma.empresa.findFirst({
                where: { instagramAccountId: entry?.id },
            });
            if (!empresa) {
                this.logger.warn(`Webhook de Instagram: no hay empresa con instagramAccountId "${entry?.id}"`);
                continue;
            }
            for (const evento of entry.messaging ?? []) {
                const texto = evento?.message?.text;
                const psid = evento?.sender?.id;
                if (!texto || !psid || evento?.message?.is_echo)
                    continue;
                await this.ingresarMensaje({
                    canal: 'INSTAGRAM',
                    empresaId: empresa.id,
                    identificadorCliente: psid,
                    contenido: texto,
                });
            }
        }
    }
    verificarHandshakeInstagram(query, verifyToken) {
        const modo = query['hub.mode'];
        const token = query['hub.verify_token'];
        const challenge = query['hub.challenge'];
        if (modo === 'subscribe' && token && verifyToken && token === verifyToken) {
            return challenge ?? '';
        }
        return null;
    }
    async ingresarMensaje(datos) {
        const cliente = await this.prisma.cliente.upsert({
            where: {
                empresaId_telefono: {
                    empresaId: datos.empresaId,
                    telefono: datos.identificadorCliente,
                },
            },
            update: datos.nombreCliente ? { nombre: datos.nombreCliente } : {},
            create: {
                empresaId: datos.empresaId,
                telefono: datos.identificadorCliente,
                nombre: datos.nombreCliente,
                canalOrigen: datos.canal,
            },
        });
        let conversacion = await this.prisma.conversacion.findFirst({
            where: {
                empresaId: datos.empresaId,
                clienteId: cliente.id,
                canal: datos.canal,
                estado: { in: ['ABIERTA', 'HANDOFF'] },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (!conversacion) {
            conversacion = await this.prisma.conversacion.create({
                data: {
                    empresaId: datos.empresaId,
                    clienteId: cliente.id,
                    canal: datos.canal,
                    estado: 'ABIERTA',
                },
            });
        }
        const mensaje = await this.prisma.mensaje.create({
            data: {
                conversacionId: conversacion.id,
                emisor: 'CLIENTE',
                tipo: 'TEXTO',
                contenido: datos.contenido,
            },
        });
        await this.prisma.conversacion.update({
            where: { id: conversacion.id },
            data: { ultimoMensajeAt: mensaje.createdAt },
        });
        await this.processMessageQueue.add('process-message', {
            empresaId: datos.empresaId,
            conversacionId: conversacion.id,
            mensajeId: mensaje.id,
            clienteId: cliente.id,
            canal: datos.canal,
        });
    }
    extraerMensajeWhatsapp(body) {
        const evento = (body?.event ?? '').toString().toLowerCase();
        if (evento !== 'messages.upsert')
            return null;
        if (typeof body?.instance !== 'string' || !body.instance)
            return null;
        const data = Array.isArray(body?.data) ? body.data[0] : body?.data;
        if (!data || data?.key?.fromMe)
            return null;
        const remoteJid = data?.key?.remoteJid;
        if (!remoteJid || remoteJid.endsWith('@g.us'))
            return null;
        const contenido = data?.message?.conversation ??
            data?.message?.extendedTextMessage?.text;
        if (!contenido)
            return null;
        return {
            instanceName: body.instance,
            telefono: remoteJid.split('@')[0],
            nombre: data.pushName,
            contenido,
        };
    }
};
exports.WebhooksService = WebhooksService;
exports.WebhooksService = WebhooksService = WebhooksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(queue_constants_1.PROCESS_MESSAGE_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], WebhooksService);
//# sourceMappingURL=webhooks.service.js.map