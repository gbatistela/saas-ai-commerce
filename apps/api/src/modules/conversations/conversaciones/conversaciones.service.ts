import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { SEND_MESSAGE_QUEUE } from '../../../infra/queue/queue.constants';
import { QueryConversacionesDto } from './dto/query-conversaciones.dto';
import { QueryMensajesDto } from './dto/query-mensajes.dto';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { AsignarConversacionDto } from './dto/asignar-conversacion.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';

@Injectable()
export class ConversacionesService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(SEND_MESSAGE_QUEUE) private readonly sendMessageQueue: Queue,
  ) {}

  async listar(empresaId: string, query: QueryConversacionesDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;

    const where: Prisma.ConversacionWhereInput = {
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

  async obtener(empresaId: string, id: string, query: QueryMensajesDto) {
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

  async enviarMensajeManual(
    empresaId: string,
    conversacionId: string,
    dto: CreateMensajeDto,
  ) {
    const conversacion = await this.buscarOFallar(empresaId, conversacionId, {
      cliente: true,
    });

    if (conversacion.estado === 'CERRADA') {
      throw new ConflictException(
        'La conversación está cerrada, reabrila antes de responder',
      );
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
        // Un agente respondiendo manualmente implica que tomó control humano.
        ...(conversacion.estado === 'ABIERTA' ? { estado: 'HANDOFF' } : {}),
      },
    });

    // El envío real por WhatsApp/Instagram lo hace un worker aparte
    // (Notifications, todavía no construido) que consume esta cola.
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

  /**
   * Manda un mensaje "de sistema" (ej. aviso de envío despachado) fuera
   * del flujo normal de chat, sin depender de que exista ya una
   * conversación abierta: reusa la última conversación del cliente por
   * ese canal si sigue abierta/en handoff, o abre una nueva. Así el aviso
   * queda visible en el historial igual que cualquier otro mensaje.
   */
  async enviarMensajeAutomatico(
    empresaId: string,
    clienteId: string,
    canal: Prisma.ConversacionCreateInput['canal'],
    contenido: string,
  ) {
    let conversacion = await this.prisma.conversacion.findFirst({
      where: { empresaId, clienteId, canal, estado: { not: 'CERRADA' } },
      orderBy: { createdAt: 'desc' },
    });

    if (!conversacion) {
      conversacion = await this.prisma.conversacion.create({
        data: { empresaId, clienteId, canal, estado: 'ABIERTA' },
      });
    }

    const mensaje = await this.prisma.mensaje.create({
      data: {
        conversacionId: conversacion.id,
        emisor: 'IA',
        tipo: 'TEXTO',
        contenido,
      },
    });

    await this.prisma.conversacion.update({
      where: { id: conversacion.id },
      data: { ultimoMensajeAt: mensaje.createdAt },
    });

    await this.sendMessageQueue.add('send-message', {
      empresaId,
      conversacionId: conversacion.id,
      mensajeId: mensaje.id,
      clienteId,
      canal,
      contenido: mensaje.contenido,
    });

    return mensaje;
  }

  async asignar(
    empresaId: string,
    conversacionId: string,
    dto: AsignarConversacionDto,
  ) {
    await this.buscarOFallar(empresaId, conversacionId);

    const usuario = await this.prisma.usuario.findFirst({
      where: { id: dto.asignadoAId, empresaId, deletedAt: null },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en esta empresa');
    }

    return this.prisma.conversacion.update({
      where: { id: conversacionId },
      data: { asignadoAId: dto.asignadoAId },
    });
  }

  async actualizarEstado(
    empresaId: string,
    conversacionId: string,
    dto: ActualizarEstadoDto,
  ) {
    await this.buscarOFallar(empresaId, conversacionId);

    return this.prisma.conversacion.update({
      where: { id: conversacionId },
      data: { estado: dto.estado },
    });
  }

  private async buscarOFallar(
    empresaId: string,
    id: string,
    include?: Prisma.ConversacionInclude,
  ) {
    const conversacion = await this.prisma.conversacion.findFirst({
      where: { id, empresaId },
      include,
    });

    if (!conversacion) {
      throw new NotFoundException('Conversación no encontrada');
    }

    return conversacion;
  }
}
