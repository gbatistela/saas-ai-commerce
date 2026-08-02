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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversacionesService = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const bullmq_2 = require("bullmq");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const queue_constants_1 = require("../../../infra/queue/queue.constants");
let ConversacionesService = class ConversacionesService {
    constructor(prisma, sendMessageQueue) {
        this.prisma = prisma;
        this.sendMessageQueue = sendMessageQueue;
    }
    async listar(empresaId, query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 20;
        const where = {
            empresaId,
            ...(query.estado ? { estado: query.estado } : {}),
            ...(query.canal ? { canal: query.canal } : {}),
            ...(query.asignadoA ? { asignadoAId: query.asignadoA } : {}),
            ...(query.cliente ? { clienteId: query.cliente } : {}),
        };
        const [data, total] = await this.prisma.$transaction([
            this.prisma.conversacion.findMany({
                where,
                include: {
                    cliente: { select: { id: true, nombre: true, telefono: true } },
                    asignadoA: { select: { id: true, nombre: true } },
                    mensajes: {
                        take: 1,
                        orderBy: { createdAt: 'desc' },
                        select: { contenido: true, emisor: true },
                    },
                },
                orderBy: { ultimoMensajeAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.conversacion.count({ where }),
        ]);
        return {
            data,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
    async obtener(empresaId, id, query) {
        const conversacion = await this.buscarOFallar(empresaId, id, {
            cliente: true,
            asignadoA: { select: { id: true, nombre: true } },
        });
        const page = query.page ?? 1;
        const limit = query.limit ?? 50;
        const [mensajes, totalMensajes] = await this.prisma.$transaction([
            this.prisma.mensaje.findMany({
                where: { conversacionId: id },
                include: { archivo: true },
                orderBy: { createdAt: 'asc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.mensaje.count({ where: { conversacionId: id } }),
        ]);
        return {
            ...conversacion,
            mensajes: {
                data: mensajes,
                meta: {
                    page,
                    limit,
                    total: totalMensajes,
                    totalPages: Math.ceil(totalMensajes / limit),
                },
            },
        };
    }
    async enviarMensajeManual(empresaId, conversacionId, dto) {
        const conversacion = await this.buscarOFallar(empresaId, conversacionId, {
            cliente: true,
        });
        if (conversacion.estado === 'CERRADA') {
            throw new common_1.ConflictException('La conversación está cerrada, reabrila antes de responder');
        }
        const mensaje = await this.prisma.mensaje.create({
            data: {
                conversacionId,
                emisor: 'HUMANO',
                tipo: dto.tipo ?? 'TEXTO',
                contenido: dto.contenido,
            },
        });
        await this.prisma.conversacion.update({
            where: { id: conversacionId },
            data: {
                ultimoMensajeAt: mensaje.createdAt,
                ...(conversacion.estado === 'ABIERTA' ? { estado: 'HANDOFF' } : {}),
            },
        });
        await this.sendMessageQueue.add('send-message', {
            empresaId,
            conversacionId,
            mensajeId: mensaje.id,
            clienteId: conversacion.clienteId,
            canal: conversacion.canal,
            contenido: mensaje.contenido,
        });
        return mensaje;
    }
    async asignar(empresaId, conversacionId, dto) {
        await this.buscarOFallar(empresaId, conversacionId);
        const usuario = await this.prisma.usuario.findFirst({
            where: { id: dto.asignadoAId, empresaId, deletedAt: null },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado en esta empresa');
        }
        return this.prisma.conversacion.update({
            where: { id: conversacionId },
            data: { asignadoAId: dto.asignadoAId },
        });
    }
    async actualizarEstado(empresaId, conversacionId, dto) {
        await this.buscarOFallar(empresaId, conversacionId);
        return this.prisma.conversacion.update({
            where: { id: conversacionId },
            data: { estado: dto.estado },
        });
    }
    async buscarOFallar(empresaId, id, include) {
        const conversacion = await this.prisma.conversacion.findFirst({
            where: { id, empresaId },
            include,
        });
        if (!conversacion) {
            throw new common_1.NotFoundException('Conversación no encontrada');
        }
        return conversacion;
    }
};
exports.ConversacionesService = ConversacionesService;
exports.ConversacionesService = ConversacionesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, bullmq_1.InjectQueue)(queue_constants_1.SEND_MESSAGE_QUEUE)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        bullmq_2.Queue])
], ConversacionesService);
//# sourceMappingURL=conversaciones.service.js.map