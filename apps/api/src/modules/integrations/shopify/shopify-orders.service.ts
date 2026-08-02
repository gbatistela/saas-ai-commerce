import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { PedidosService } from '../../sales/pedidos/pedidos.service';
import { ClientesService } from '../../crm/clientes/clientes.service';
import { ConversacionesService } from '../../conversations/conversaciones/conversaciones.service';
import type { ShopifyFulfillment, ShopifyOrder } from './types/shopify.types';

/**
 * Traduce los webhooks de pedidos/envíos de Shopify a nuestro propio
 * modelo (Pedido/Seguimiento/Conversacion). El checkout en sí pasa por
 * Shopify — acá solo espejamos el resultado para que el panel y la IA
 * tengan contexto, y avisamos por WhatsApp cuando hay tracking.
 */
@Injectable()
export class ShopifyOrdersService {
  private readonly logger = new Logger(ShopifyOrdersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly pedidosService: PedidosService,
    private readonly clientesService: ClientesService,
    private readonly conversacionesService: ConversacionesService,
  ) {}

  async procesarOrdenCreada(empresaId: string, orden: ShopifyOrder) {
    const shopifyOrderId = String(orden.id);

    const yaExiste = await this.prisma.pedido.findUnique({
      where: { shopifyOrderId },
    });
    if (yaExiste) {
      this.logger.log(`Pedido de Shopify ${shopifyOrderId} ya estaba importado, se omite`);
      return yaExiste;
    }

    const cliente = await this.buscarOCrearCliente(empresaId, orden);

    let direccionId: string | undefined;
    if (orden.shipping_address) {
      const dir = orden.shipping_address;
      const direccion = await this.clientesService.agregarDireccion(empresaId, cliente.id, {
        calle: dir.address1 || 'Sin especificar',
        numero: undefined,
        ciudad: dir.city || 'Sin especificar',
        provincia: dir.province ?? undefined,
        cp: dir.zip ?? undefined,
        referencia: dir.address2 ?? undefined,
        esPrincipal: true,
      });
      direccionId = direccion.id;
    }

    const items: { varianteId: string; cantidad: number; precioUnitario: number }[] = [];
    for (const lineItem of orden.line_items) {
      if (!lineItem.variant_id) continue;
      const variante = await this.prisma.variante.findUnique({
        where: { shopifyVariantId: String(lineItem.variant_id) },
      });
      if (!variante) {
        this.logger.warn(
          `Variante Shopify ${lineItem.variant_id} no encontrada localmente (¿falta sincronizar el catálogo?), se omite del pedido ${shopifyOrderId}`,
        );
        continue;
      }
      items.push({
        varianteId: variante.id,
        cantidad: lineItem.quantity,
        precioUnitario: Number(lineItem.price),
      });
    }

    if (items.length === 0) {
      this.logger.warn(
        `Pedido de Shopify ${shopifyOrderId} no tiene ningún item con variante reconocida, se omite la importación`,
      );
      return null;
    }

    const envio = Number(orden.total_shipping_price_set?.shop_money.amount ?? 0);

    return this.pedidosService.crearDesdeExterno(empresaId, {
      clienteId: cliente.id,
      numeroPedido: orden.name,
      origenExternoId: shopifyOrderId,
      items,
      subtotal: Number(orden.subtotal_price),
      envio,
      total: Number(orden.total_price),
      direccionId,
    });
  }

  async procesarFulfillmentCreado(empresaId: string, fulfillment: ShopifyFulfillment) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { shopifyOrderId: String(fulfillment.order_id) },
      include: { cliente: true },
    });

    if (!pedido) {
      this.logger.warn(
        `Fulfillment de Shopify para el pedido ${fulfillment.order_id}, pero no encontramos ese pedido localmente`,
      );
      return null;
    }

    await this.pedidosService.agregarSeguimiento(empresaId, pedido.id, {
      transportista: fulfillment.tracking_company ?? undefined,
      numeroTracking: fulfillment.tracking_number ?? undefined,
      urlTracking: fulfillment.tracking_url ?? undefined,
    });

    await this.pedidosService.actualizarEstado(empresaId, pedido.id, {
      estado: 'DESPACHADO',
    });

    if (pedido.cliente.telefono && !pedido.cliente.telefono.startsWith('web:')) {
      const partes = [`Tu pedido ${pedido.numeroPedido} ya fue despachado.`];
      if (fulfillment.tracking_number) {
        partes.push(`Número de seguimiento: ${fulfillment.tracking_number}.`);
      }
      if (fulfillment.tracking_url) {
        partes.push(fulfillment.tracking_url);
      }

      await this.conversacionesService.enviarMensajeAutomatico(
        empresaId,
        pedido.clienteId,
        'WHATSAPP',
        partes.join(' '),
      );
    }

    return pedido;
  }

  private async buscarOCrearCliente(empresaId: string, orden: ShopifyOrder) {
    const telefono = this.normalizarTelefono(orden.phone ?? orden.customer?.phone ?? null);
    const email = orden.email ?? orden.customer?.email ?? null;
    const nombre = orden.customer
      ? [orden.customer.first_name, orden.customer.last_name].filter(Boolean).join(' ') || null
      : orden.shipping_address?.name ?? null;

    const existente = await this.prisma.cliente.findFirst({
      where: {
        empresaId,
        deletedAt: null,
        OR: [
          ...(telefono ? [{ telefono }] : []),
          ...(email ? [{ email }] : []),
        ],
      },
    });
    if (existente) return existente;

    return this.prisma.cliente.create({
      data: {
        empresaId,
        telefono,
        email,
        nombre,
        canalOrigen: 'WEB',
      },
    });
  }

  private normalizarTelefono(telefono: string | null): string | null {
    if (!telefono) return null;
    return telefono.replace(/[^\d+]/g, '') || null;
  }
}
