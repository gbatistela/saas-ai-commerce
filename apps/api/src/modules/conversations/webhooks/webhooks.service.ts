import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { CanalOrigen } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { PROCESS_MESSAGE_QUEUE } from '../../../infra/queue/queue.constants';

interface MensajeEntrante {
  canal: CanalOrigen;
  empresaId: string;
  // Identificador del cliente dentro del canal. Se guarda en Cliente.telefono
  // porque el schema no tiene un campo genérico "id externo por canal": para
  // WhatsApp es el número, para Instagram es el PSID (id de remitente).
  identificadorCliente: string;
  nombreCliente?: string;
  contenido: string;
}

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue(PROCESS_MESSAGE_QUEUE)
    private readonly processMessageQueue: Queue,
  ) {}

  async procesarWhatsapp(body: any) {
    const evento = this.extraerMensajeWhatsapp(body);
    if (!evento) return;

    const empresa = await this.prisma.empresa.findUnique({
      where: { slug: evento.instanceName },
    });

    if (!empresa) {
      this.logger.warn(
        `Webhook de WhatsApp: no hay empresa con slug de instancia "${evento.instanceName}"`,
      );
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

  async procesarInstagram(body: any) {
    if (body?.object !== 'instagram') return;

    for (const entry of body.entry ?? []) {
      const empresa = await this.prisma.empresa.findFirst({
        where: { instagramAccountId: entry?.id },
      });

      if (!empresa) {
        this.logger.warn(
          `Webhook de Instagram: no hay empresa con instagramAccountId "${entry?.id}"`,
        );
        continue;
      }

      for (const evento of entry.messaging ?? []) {
        const texto: string | undefined = evento?.message?.text;
        const psid: string | undefined = evento?.sender?.id;

        // is_echo = mensaje que la propia empresa envió (eco), no un mensaje entrante.
        if (!texto || !psid || evento?.message?.is_echo) continue;

        await this.ingresarMensaje({
          canal: 'INSTAGRAM',
          empresaId: empresa.id,
          identificadorCliente: psid,
          contenido: texto,
        });
      }
    }
  }

  /** Handshake GET de verificación de Meta. Devuelve el challenge si el token coincide, o null. */
  verificarHandshakeInstagram(
    query: Record<string, string>,
    verifyToken: string,
  ): string | null {
    const modo = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (modo === 'subscribe' && token && verifyToken && token === verifyToken) {
      return challenge ?? '';
    }
    return null;
  }

  private async ingresarMensaje(datos: MensajeEntrante) {
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

    // El AI Engine (próximo módulo) es quien procesa este job: arma el
    // prompt, llama al modelo, ejecuta function calling y responde.
    await this.processMessageQueue.add('process-message', {
      empresaId: datos.empresaId,
      conversacionId: conversacion.id,
      mensajeId: mensaje.id,
      clienteId: cliente.id,
      canal: datos.canal,
    });
  }

  /**
   * Evolution API envía distintos tipos de evento (connection.update,
   * qrcode.updated, messages.upsert, etc.) al mismo webhook. Acá nos
   * quedamos solo con mensajes entrantes de texto y descartamos el resto
   * sin romper (siempre 200, nunca 500, para no gatillar reintentos/ban).
   *
   * Convención asumida: el nombre de la instancia de Evolution API es el
   * slug de la empresa (se define al conectar el número). Si se integra
   * distinto, ajustar solo este método.
   */
  private extraerMensajeWhatsapp(body: any): {
    instanceName: string;
    telefono: string;
    nombre?: string;
    contenido: string;
  } | null {
    const evento = (body?.event ?? '').toString().toLowerCase();
    if (evento !== 'messages.upsert') return null;

    if (typeof body?.instance !== 'string' || !body.instance) return null;

    const data = Array.isArray(body?.data) ? body.data[0] : body?.data;
    if (!data || data?.key?.fromMe) return null;

    const remoteJid: string | undefined = data?.key?.remoteJid;
    if (!remoteJid || remoteJid.endsWith('@g.us')) return null; // ignora grupos

    const contenido: string | undefined =
      data?.message?.conversation ??
      data?.message?.extendedTextMessage?.text;

    if (!contenido) return null;

    return {
      instanceName: body.instance,
      telefono: remoteJid.split('@')[0],
      nombre: data.pushName,
      contenido,
    };
  }
}
