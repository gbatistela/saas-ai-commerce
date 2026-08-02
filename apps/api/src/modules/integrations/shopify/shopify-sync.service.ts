import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { ShopifyApiClient } from './shopify-api.client';
import type { ShopifyProduct } from './types/shopify.types';

const DEPOSITO_DEFAULT = 'principal';

/**
 * Trae el catálogo completo de Shopify y lo espeja en Producto/Variante/
 * Stock vía upsert por shopifyProductId/shopifyVariantId (ids globalmente
 * únicos en Shopify, así que sirven de clave de idempotencia sin importar
 * cuántas veces se corra el sync).
 *
 * Las fotos solo se importan la primera vez que se ve un producto (si ya
 * tiene archivos cargados, no se tocan) para no duplicar ni pisar fotos
 * que un usuario haya subido/reordenado manualmente en el panel.
 */
@Injectable()
export class ShopifySyncService {
  private readonly logger = new Logger(ShopifySyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly shopifyApi: ShopifyApiClient,
  ) {}

  async sincronizarCatalogo(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({ where: { id: empresaId } });
    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }
    if (!empresa.shopifyShopDomain || !empresa.shopifyAccessToken) {
      throw new BadRequestException(
        'Esta empresa todavía no tiene configurado el shop domain / access token de Shopify',
      );
    }

    let pageInfo: string | undefined;
    let productosSincronizados = 0;

    do {
      const { productos, siguientePageInfo } = await this.shopifyApi.listarProductosPagina(
        empresa.shopifyShopDomain,
        empresa.shopifyAccessToken,
        pageInfo,
      );

      for (const producto of productos) {
        await this.upsertProducto(empresaId, producto);
        productosSincronizados++;
      }

      pageInfo = siguientePageInfo ?? undefined;
    } while (pageInfo);

    this.logger.log(`Sync de Shopify completo para empresa ${empresaId}: ${productosSincronizados} productos`);
    return { productosSincronizados };
  }

  /** Llamado por el webhook `products/update`: el payload ya trae el producto completo, no hace falta ir a buscarlo. */
  async sincronizarProductoWebhook(empresaId: string, producto: ShopifyProduct) {
    return this.upsertProducto(empresaId, producto);
  }

  private async upsertProducto(empresaId: string, producto: ShopifyProduct) {
    const primeraVariante = producto.variants[0];
    const precio = primeraVariante ? Number(primeraVariante.price) : 0;
    const shopifyProductId = String(producto.id);

    const productoLocal = await this.prisma.producto.upsert({
      where: { shopifyProductId },
      create: {
        empresaId,
        shopifyProductId,
        sku: primeraVariante?.sku || shopifyProductId,
        nombre: producto.title,
        descripcion: this.limpiarHtml(producto.body_html),
        precio,
        estado: producto.status === 'active' ? 'ACTIVO' : 'INACTIVO',
      },
      update: {
        nombre: producto.title,
        descripcion: this.limpiarHtml(producto.body_html),
        precio,
        estado: producto.status === 'active' ? 'ACTIVO' : 'INACTIVO',
      },
    });

    for (const variante of producto.variants) {
      await this.upsertVariante(productoLocal.id, variante, precio);
    }

    const tieneArchivos = await this.prisma.archivoProducto.findFirst({
      where: { productoId: productoLocal.id },
    });
    if (!tieneArchivos && producto.images.length > 0) {
      await this.importarImagenes(empresaId, productoLocal.id, producto);
    }
  }

  private async upsertVariante(
    productoId: string,
    variante: ShopifyProduct['variants'][number],
    precioBase: number,
  ) {
    const shopifyVariantId = String(variante.id);
    const skuVariante = variante.sku || shopifyVariantId;
    const precioAdicional = Number(variante.price) - precioBase;

    const varianteLocal = await this.prisma.variante.upsert({
      where: { shopifyVariantId },
      create: {
        productoId,
        shopifyVariantId,
        skuVariante,
        talle: variante.option1,
        color: variante.option2,
        precioAdicional,
      },
      update: {
        skuVariante,
        talle: variante.option1,
        color: variante.option2,
        precioAdicional,
      },
    });

    await this.prisma.stock.upsert({
      where: { varianteId_deposito: { varianteId: varianteLocal.id, deposito: DEPOSITO_DEFAULT } },
      create: {
        varianteId: varianteLocal.id,
        deposito: DEPOSITO_DEFAULT,
        cantidad: variante.inventory_quantity ?? 0,
      },
      update: {
        cantidad: variante.inventory_quantity ?? 0,
      },
    });
  }

  private async importarImagenes(empresaId: string, productoId: string, producto: ShopifyProduct) {
    const imagenesOrdenadas = [...producto.images].sort(
      (a, b) => (a.position ?? 0) - (b.position ?? 0),
    );

    for (const [orden, imagen] of imagenesOrdenadas.entries()) {
      const archivo = await this.prisma.archivo.create({
        data: { empresaId, url: imagen.src, tipoMime: 'image/jpeg' },
      });
      await this.prisma.archivoProducto.create({
        data: { productoId, archivoId: archivo.id, tipo: 'IMAGEN', orden },
      });
    }
  }

  private limpiarHtml(html: string | null): string | null {
    if (!html) return null;
    return html.replace(/<[^>]+>/g, '').trim() || null;
  }
}
