/**
 * Formas mínimas de los payloads de la Admin REST API / webhooks de
 * Shopify que consumimos. No son DTOs validados (vienen de un tercero,
 * no de nuestros propios clientes) — solo tipado para el compilador.
 */

export interface ShopifyImage {
  id: number;
  src: string;
  position?: number;
}

export interface ShopifyVariant {
  id: number;
  product_id: number;
  sku: string | null;
  price: string;
  option1: string | null;
  option2: string | null;
  inventory_quantity?: number;
  image_id?: number | null;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string | null;
  status: 'active' | 'archived' | 'draft';
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  options?: { name: string; position: number }[];
}

export interface ShopifyProductsResponse {
  products: ShopifyProduct[];
}

export interface ShopifyLineItem {
  variant_id: number | null;
  quantity: number;
  price: string;
}

export interface ShopifyAddress {
  name?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  province?: string | null;
  zip?: string | null;
  country?: string | null;
  phone?: string | null;
}

export interface ShopifyOrder {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  total_price: string;
  subtotal_price: string;
  total_shipping_price_set?: { shop_money: { amount: string } };
  customer?: { phone?: string | null; email?: string | null; first_name?: string | null; last_name?: string | null };
  shipping_address?: ShopifyAddress | null;
  line_items: ShopifyLineItem[];
}

export interface ShopifyFulfillment {
  id: number;
  order_id: number;
  tracking_company: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
}
