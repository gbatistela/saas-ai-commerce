import { Injectable, BadGatewayException } from '@nestjs/common';
import type { ShopifyProduct, ShopifyProductsResponse } from './types/shopify.types';

const API_VERSION = '2024-10';

/**
 * Cliente delgado sobre la Admin REST API de Shopify. Cada empresa tiene
 * su propio shop domain + access token (guardados en Empresa), así que no
 * hay estado acá — se pasan como parámetros en cada llamada.
 */
@Injectable()
export class ShopifyApiClient {
  async listarProductosPagina(
    shopDomain: string,
    accessToken: string,
    pageInfo?: string,
  ): Promise<{ productos: ShopifyProduct[]; siguientePageInfo: string | null }> {
    const url = new URL(`https://${shopDomain}/admin/api/${API_VERSION}/products.json`);
    url.searchParams.set('limit', '250');
    if (pageInfo) {
      url.searchParams.set('page_info', pageInfo);
    }

    const res = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': accessToken },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new BadGatewayException(
        `Shopify respondió ${res.status} al listar productos: ${body}`,
      );
    }

    const data = (await res.json()) as ShopifyProductsResponse;
    const siguientePageInfo = this.extraerSiguientePageInfo(res.headers.get('link'));

    return { productos: data.products, siguientePageInfo };
  }

  /**
   * El header `Link` de Shopify (paginación por cursor, no por número de
   * página) trae algo como:
   * `<https://shop.myshopify.com/...&page_info=xyz>; rel="next"`
   */
  private extraerSiguientePageInfo(linkHeader: string | null): string | null {
    if (!linkHeader) return null;
    const siguiente = linkHeader
      .split(',')
      .find((parte) => parte.includes('rel="next"'));
    if (!siguiente) return null;

    const match = siguiente.match(/page_info=([^&>]+)/);
    return match ? match[1] : null;
  }
}
