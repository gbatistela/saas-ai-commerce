import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';
import { Public } from '../../../common/decorators/public.decorator';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { ShopifySyncService } from './shopify-sync.service';
import { ShopifyOrdersService } from './shopify-orders.service';
import type { ShopifyFulfillment, ShopifyOrder, ShopifyProduct } from './types/shopify.types';

/**
 * Recibe los webhooks de Shopify (configurados a mano en el admin de cada
 * tienda, ver instrucciones en la pestaña Shopify de Ajustes). Excluido de
 * Swagger: es un endpoint para Shopify, no para clientes de la API propia.
 */
@ApiExcludeController()
@Controller('webhooks/shopify')
export class ShopifyWebhooksController {
  private readonly logger = new Logger(ShopifyWebhooksController.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly shopifySync: ShopifySyncService,
    private readonly shopifyOrders: ShopifyOrdersService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  async recibir(
    @Req() req: RawBodyRequest<Request>,
    @Headers('x-shopify-shop-domain') shopDomain?: string,
    @Headers('x-shopify-topic') topic?: string,
    @Headers('x-shopify-hmac-sha256') hmacHeader?: string,
  ) {
    if (!shopDomain || !topic || !hmacHeader || !req.rawBody) {
      throw new BadRequestException('Faltan headers de Shopify en el webhook');
    }

    const empresa = await this.prisma.empresa.findFirst({
      where: { shopifyShopDomain: shopDomain },
    });

    if (!empresa?.shopifyWebhookSecret) {
      throw new UnauthorizedException('Tienda de Shopify no reconocida');
    }

    if (!this.firmaValida(req.rawBody, hmacHeader, empresa.shopifyWebhookSecret)) {
      throw new UnauthorizedException('Firma HMAC inválida');
    }

    const payload = JSON.parse(req.rawBody.toString('utf8'));

    switch (topic) {
      case 'products/create':
      case 'products/update':
        await this.shopifySync.sincronizarProductoWebhook(empresa.id, payload as ShopifyProduct);
        break;
      case 'orders/create':
        await this.shopifyOrders.procesarOrdenCreada(empresa.id, payload as ShopifyOrder);
        break;
      case 'fulfillments/create':
      case 'fulfillments/update':
        await this.shopifyOrders.procesarFulfillmentCreado(empresa.id, payload as ShopifyFulfillment);
        break;
      default:
        this.logger.log(`Topic de Shopify sin manejar: ${topic}, se ignora`);
    }

    return { received: true };
  }

  private firmaValida(rawBody: Buffer, hmacHeader: string, secret: string): boolean {
    const digest = createHmac('sha256', secret).update(rawBody).digest('base64');

    const digestBuf = Buffer.from(digest);
    const headerBuf = Buffer.from(hmacHeader);
    if (digestBuf.length !== headerBuf.length) return false;

    return timingSafeEqual(digestBuf, headerBuf);
  }
}
