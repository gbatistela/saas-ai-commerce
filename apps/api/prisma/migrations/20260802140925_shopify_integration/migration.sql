-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "shopify_access_token" TEXT,
ADD COLUMN     "shopify_shop_domain" TEXT,
ADD COLUMN     "shopify_webhook_secret" TEXT;

-- AlterTable
ALTER TABLE "pedidos" ADD COLUMN     "shopify_order_id" TEXT;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "shopify_product_id" TEXT;

-- AlterTable
ALTER TABLE "variantes" ADD COLUMN     "shopify_variant_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_shopify_order_id_key" ON "pedidos"("shopify_order_id");

-- CreateIndex
CREATE UNIQUE INDEX "productos_shopify_product_id_key" ON "productos"("shopify_product_id");

-- CreateIndex
CREATE UNIQUE INDEX "variantes_shopify_variant_id_key" ON "variantes"("shopify_variant_id");

