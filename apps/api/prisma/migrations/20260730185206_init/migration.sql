-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "EstadoGeneral" AS ENUM ('ACTIVO', 'INACTIVO', 'SUSPENDIDO');

-- CreateEnum
CREATE TYPE "CanalOrigen" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'WEB', 'MANUAL');

-- CreateEnum
CREATE TYPE "EstadoConversacion" AS ENUM ('ABIERTA', 'CERRADA', 'HANDOFF');

-- CreateEnum
CREATE TYPE "EmisorMensaje" AS ENUM ('CLIENTE', 'IA', 'HUMANO');

-- CreateEnum
CREATE TYPE "TipoMensaje" AS ENUM ('TEXTO', 'IMAGEN', 'AUDIO', 'VIDEO', 'DOCUMENTO', 'UBICACION');

-- CreateEnum
CREATE TYPE "TipoPrompt" AS ENUM ('SYSTEM', 'VENTAS', 'SOPORTE', 'RECLAMOS');

-- CreateEnum
CREATE TYPE "EstadoCarrito" AS ENUM ('ACTIVO', 'ABANDONADO', 'CONVERTIDO');

-- CreateEnum
CREATE TYPE "TipoCupon" AS ENUM ('PORCENTAJE', 'MONTO_FIJO');

-- CreateEnum
CREATE TYPE "EstadoPedidoEnum" AS ENUM ('PENDIENTE', 'PREPARANDO', 'EMPAQUETADO', 'DESPACHADO', 'EN_VIAJE', 'ENTREGADO', 'CANCELADO', 'DEVUELTO');

-- CreateEnum
CREATE TYPE "ProveedorPago" AS ENUM ('MERCADO_PAGO', 'STRIPE');

-- CreateEnum
CREATE TYPE "EstadoPago" AS ENUM ('PENDIENTE', 'APROBADO', 'RECHAZADO', 'REEMBOLSADO');

-- CreateEnum
CREATE TYPE "CanalCampana" AS ENUM ('WHATSAPP', 'INSTAGRAM', 'EMAIL');

-- CreateEnum
CREATE TYPE "EstadoCampana" AS ENUM ('BORRADOR', 'PROGRAMADA', 'ENVIANDO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoArchivoProducto" AS ENUM ('IMAGEN', 'VIDEO', 'PDF');

-- CreateEnum
CREATE TYPE "TipoRelacionProducto" AS ENUM ('SIMILAR', 'COMPLEMENTARIO', 'COMBO');

-- CreateEnum
CREATE TYPE "EstadoReclamo" AS ENUM ('ABIERTO', 'EN_PROCESO', 'RESUELTO', 'ESCALADO', 'CERRADO');

-- CreateEnum
CREATE TYPE "PrioridadReclamo" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "TipoRecordatorio" AS ENUM ('CARRITO_ABANDONADO', 'PEDIDO_PENDIENTE', 'SEGUIMIENTO_MANUAL');

-- CreateTable
CREATE TABLE "empresas" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "rubro" TEXT,
    "logo_url" TEXT,
    "telefono_whatsapp" TEXT,
    "instagram_account_id" TEXT,
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "timezone" TEXT NOT NULL DEFAULT 'America/Argentina/Buenos_Aires',
    "plan" TEXT NOT NULL DEFAULT 'trial',
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "config_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "avatar_url" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "ultimo_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "es_sistema" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permisos" (
    "id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT,
    "modulo" TEXT NOT NULL,

    CONSTRAINT "permisos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario_roles" (
    "usuario_id" TEXT NOT NULL,
    "rol_id" TEXT NOT NULL,

    CONSTRAINT "usuario_roles_pkey" PRIMARY KEY ("usuario_id","rol_id")
);

-- CreateTable
CREATE TABLE "rol_permisos" (
    "rol_id" TEXT NOT NULL,
    "permiso_id" TEXT NOT NULL,

    CONSTRAINT "rol_permisos_pkey" PRIMARY KEY ("rol_id","permiso_id")
);

-- CreateTable
CREATE TABLE "clientes" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT,
    "telefono" TEXT,
    "email" TEXT,
    "canal_origen" "CanalOrigen" NOT NULL DEFAULT 'WHATSAPP',
    "es_frecuente" BOOLEAN NOT NULL DEFAULT false,
    "presupuesto_estimado" DECIMAL(65,30),
    "talle_preferido" TEXT,
    "color_preferido" TEXT,
    "marca_preferida" TEXT,
    "metodo_pago_preferido" TEXT,
    "notas_ia" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" TEXT,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT,
    "cp" TEXT,
    "referencia" TEXT,
    "es_principal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "etiquetas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "color" TEXT,

    CONSTRAINT "etiquetas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente_etiquetas" (
    "cliente_id" TEXT NOT NULL,
    "etiqueta_id" TEXT NOT NULL,

    CONSTRAINT "cliente_etiquetas_pkey" PRIMARY KEY ("cliente_id","etiqueta_id")
);

-- CreateTable
CREATE TABLE "favoritos" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favoritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historial_interacciones" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "referencia_id" TEXT,
    "descripcion" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historial_interacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversaciones" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "canal" "CanalOrigen" NOT NULL,
    "estado" "EstadoConversacion" NOT NULL DEFAULT 'ABIERTA',
    "asignado_a" TEXT,
    "ultimo_mensaje_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conversaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mensajes" (
    "id" TEXT NOT NULL,
    "conversacion_id" TEXT NOT NULL,
    "emisor" "EmisorMensaje" NOT NULL,
    "tipo" "TipoMensaje" NOT NULL DEFAULT 'TEXTO',
    "contenido" TEXT,
    "archivo_id" TEXT,
    "tokens_usados" INTEGER,
    "costo_usd" DECIMAL(65,30),
    "intencion_detectada" TEXT,
    "sentimiento" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensajes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "respuestas_rapidas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "atajo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,

    CONSTRAINT "respuestas_rapidas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuraciones_ia" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "tono" TEXT,
    "reglas_negocio_json" JSONB,
    "modelo_openai" TEXT NOT NULL DEFAULT 'gpt-4o-mini',
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "max_tokens" INTEGER NOT NULL DEFAULT 600,
    "horario_atencion_json" JSONB,
    "condiciones_handoff_json" JSONB,

    CONSTRAINT "configuraciones_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompts" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "tipo" "TipoPrompt" NOT NULL,
    "contenido" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embeddings" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "entidad_tipo" TEXT NOT NULL,
    "entidad_id" TEXT NOT NULL,
    "contenido_fuente" TEXT NOT NULL,
    "vector" vector(1536) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_ia" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "mensaje_id" TEXT NOT NULL,
    "prompt_enviado" TEXT NOT NULL,
    "respuesta_cruda" TEXT,
    "funcion_llamada" TEXT,
    "tokens_prompt" INTEGER,
    "tokens_completion" INTEGER,
    "costo_usd" DECIMAL(65,30),
    "latencia_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_ia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorias" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria_padre_id" TEXT,

    CONSTRAINT "categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marcas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "logo_url" TEXT,

    CONSTRAINT "marcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "categoria_id" TEXT,
    "marca_id" TEXT,
    "sku" TEXT NOT NULL,
    "codigo_barras" TEXT,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "precio" DECIMAL(65,30) NOT NULL,
    "costo" DECIMAL(65,30),
    "peso" DECIMAL(65,30),
    "seo_slug" TEXT,
    "seo_meta" TEXT,
    "estado" "EstadoGeneral" NOT NULL DEFAULT 'ACTIVO',
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variantes" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "color" TEXT,
    "talle" TEXT,
    "sku_variante" TEXT NOT NULL,
    "precio_adicional" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "imagen_url" TEXT,

    CONSTRAINT "variantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock" (
    "id" TEXT NOT NULL,
    "variante_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 0,
    "deposito" TEXT DEFAULT 'principal',
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos_producto" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "archivo_id" TEXT NOT NULL,
    "tipo" "TipoArchivoProducto" NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "archivos_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "producto_etiquetas" (
    "producto_id" TEXT NOT NULL,
    "etiqueta_id" TEXT NOT NULL,

    CONSTRAINT "producto_etiquetas_pkey" PRIMARY KEY ("producto_id","etiqueta_id")
);

-- CreateTable
CREATE TABLE "productos_relacionados" (
    "id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "relacionado_id" TEXT NOT NULL,
    "tipo" "TipoRelacionProducto" NOT NULL,

    CONSTRAINT "productos_relacionados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carritos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "estado" "EstadoCarrito" NOT NULL DEFAULT 'ACTIVO',
    "ultima_actividad_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito_items" (
    "id" TEXT NOT NULL,
    "carrito_id" TEXT NOT NULL,
    "variante_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "precio_unitario" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "carrito_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupones" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" "TipoCupon" NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "usos_maximos" INTEGER,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "descuentos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "condicion_json" JSONB NOT NULL,
    "valor" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "carrito_id" TEXT,
    "numero_pedido" TEXT NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,
    "descuento_total" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "envio" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "total" DECIMAL(65,30) NOT NULL,
    "cupon_id" TEXT,
    "direccion_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_items" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "variante_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(65,30) NOT NULL,
    "subtotal" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "pedido_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "estados_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "estado" "EstadoPedidoEnum" NOT NULL,
    "comentario" TEXT,
    "usuario_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estados_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seguimiento_envios" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "transportista" TEXT,
    "numero_tracking" TEXT,
    "url_tracking" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seguimiento_envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "proveedor" "ProveedorPago" NOT NULL,
    "monto" DECIMAL(65,30) NOT NULL,
    "moneda" TEXT NOT NULL DEFAULT 'ARS',
    "estado" "EstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "link_pago" TEXT,
    "qr_url" TEXT,
    "external_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transacciones" (
    "id" TEXT NOT NULL,
    "pago_id" TEXT NOT NULL,
    "payload_json" JSONB NOT NULL,
    "tipo_evento" TEXT NOT NULL,
    "procesado" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transacciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campanas" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "canal" "CanalCampana" NOT NULL,
    "contenido_template" TEXT NOT NULL,
    "variables_json" JSONB,
    "estado" "EstadoCampana" NOT NULL DEFAULT 'BORRADOR',
    "fecha_programada" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiencias" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "criterio_json" JSONB NOT NULL,
    "campana_id" TEXT,

    CONSTRAINT "audiencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audiencia_clientes" (
    "audiencia_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,

    CONSTRAINT "audiencia_clientes_pkey" PRIMARY KEY ("audiencia_id","cliente_id")
);

-- CreateTable
CREATE TABLE "campana_envios" (
    "id" TEXT NOT NULL,
    "campana_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "estado_envio" TEXT NOT NULL,
    "abierto" BOOLEAN NOT NULL DEFAULT false,
    "click" BOOLEAN NOT NULL DEFAULT false,
    "conversion" BOOLEAN NOT NULL DEFAULT false,
    "enviado_at" TIMESTAMP(3),

    CONSTRAINT "campana_envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reclamos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "pedido_id" TEXT,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" "EstadoReclamo" NOT NULL DEFAULT 'ABIERTO',
    "asignado_a" TEXT,
    "prioridad" "PrioridadReclamo" NOT NULL DEFAULT 'MEDIA',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reclamos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos_reclamo" (
    "id" TEXT NOT NULL,
    "reclamo_id" TEXT NOT NULL,
    "archivo_id" TEXT NOT NULL,
    "tipo" "TipoMensaje" NOT NULL,

    CONSTRAINT "archivos_reclamo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "devoluciones" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "reclamo_id" TEXT,
    "motivo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "monto_reembolso" DECIMAL(65,30),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "devoluciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "entidad_tipo" TEXT,
    "entidad_id" TEXT,
    "metadata_json" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_auditoria" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "usuario_id" TEXT,
    "accion" TEXT NOT NULL,
    "entidad_tipo" TEXT,
    "entidad_id" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archivos" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tipo_mime" TEXT NOT NULL,
    "tamano_bytes" INTEGER,
    "bucket" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "archivos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificaciones" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "leida" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificaciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recordatorios" (
    "id" TEXT NOT NULL,
    "empresa_id" TEXT NOT NULL,
    "tipo" "TipoRecordatorio" NOT NULL,
    "carrito_id" TEXT,
    "referencia_id" TEXT,
    "ejecutar_at" TIMESTAMP(3) NOT NULL,
    "ejecutado" BOOLEAN NOT NULL DEFAULT false,
    "canal" "CanalOrigen" NOT NULL,

    CONSTRAINT "recordatorios_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_slug_key" ON "empresas"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_empresa_id_email_key" ON "usuarios"("empresa_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "permisos_codigo_key" ON "permisos"("codigo");

-- CreateIndex
CREATE INDEX "clientes_empresa_id_email_idx" ON "clientes"("empresa_id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_empresa_id_telefono_key" ON "clientes"("empresa_id", "telefono");

-- CreateIndex
CREATE UNIQUE INDEX "etiquetas_empresa_id_nombre_key" ON "etiquetas"("empresa_id", "nombre");

-- CreateIndex
CREATE UNIQUE INDEX "favoritos_cliente_id_producto_id_key" ON "favoritos"("cliente_id", "producto_id");

-- CreateIndex
CREATE INDEX "conversaciones_empresa_id_estado_idx" ON "conversaciones"("empresa_id", "estado");

-- CreateIndex
CREATE INDEX "mensajes_conversacion_id_created_at_idx" ON "mensajes"("conversacion_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "respuestas_rapidas_empresa_id_atajo_key" ON "respuestas_rapidas"("empresa_id", "atajo");

-- CreateIndex
CREATE UNIQUE INDEX "configuraciones_ia_empresa_id_key" ON "configuraciones_ia"("empresa_id");

-- CreateIndex
CREATE INDEX "prompts_empresa_id_tipo_activo_idx" ON "prompts"("empresa_id", "tipo", "activo");

-- CreateIndex
CREATE INDEX "embeddings_empresa_id_entidad_tipo_idx" ON "embeddings"("empresa_id", "entidad_tipo");

-- CreateIndex
CREATE UNIQUE INDEX "logs_ia_mensaje_id_key" ON "logs_ia"("mensaje_id");

-- CreateIndex
CREATE INDEX "productos_empresa_id_estado_idx" ON "productos"("empresa_id", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "productos_empresa_id_sku_key" ON "productos"("empresa_id", "sku");

-- CreateIndex
CREATE UNIQUE INDEX "variantes_producto_id_sku_variante_key" ON "variantes"("producto_id", "sku_variante");

-- CreateIndex
CREATE UNIQUE INDEX "stock_variante_id_deposito_key" ON "stock"("variante_id", "deposito");

-- CreateIndex
CREATE UNIQUE INDEX "productos_relacionados_producto_id_relacionado_id_tipo_key" ON "productos_relacionados"("producto_id", "relacionado_id", "tipo");

-- CreateIndex
CREATE INDEX "carritos_empresa_id_estado_idx" ON "carritos"("empresa_id", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "carrito_items_carrito_id_variante_id_key" ON "carrito_items"("carrito_id", "variante_id");

-- CreateIndex
CREATE UNIQUE INDEX "cupones_empresa_id_codigo_key" ON "cupones"("empresa_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_carrito_id_key" ON "pedidos"("carrito_id");

-- CreateIndex
CREATE UNIQUE INDEX "pedidos_empresa_id_numero_pedido_key" ON "pedidos"("empresa_id", "numero_pedido");

-- CreateIndex
CREATE INDEX "estados_pedido_pedido_id_created_at_idx" ON "estados_pedido"("pedido_id", "created_at");

-- CreateIndex
CREATE INDEX "pagos_empresa_id_estado_idx" ON "pagos"("empresa_id", "estado");

-- CreateIndex
CREATE UNIQUE INDEX "campana_envios_campana_id_cliente_id_key" ON "campana_envios"("campana_id", "cliente_id");

-- CreateIndex
CREATE UNIQUE INDEX "devoluciones_reclamo_id_key" ON "devoluciones"("reclamo_id");

-- CreateIndex
CREATE INDEX "eventos_empresa_id_tipo_created_at_idx" ON "eventos"("empresa_id", "tipo", "created_at");

-- CreateIndex
CREATE INDEX "recordatorios_ejecutar_at_ejecutado_idx" ON "recordatorios"("ejecutar_at", "ejecutado");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roles" ADD CONSTRAINT "roles_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuario_roles" ADD CONSTRAINT "usuario_roles_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rol_permisos" ADD CONSTRAINT "rol_permisos_permiso_id_fkey" FOREIGN KEY ("permiso_id") REFERENCES "permisos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "etiquetas" ADD CONSTRAINT "etiquetas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_etiquetas" ADD CONSTRAINT "cliente_etiquetas_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cliente_etiquetas" ADD CONSTRAINT "cliente_etiquetas_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "etiquetas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoritos" ADD CONSTRAINT "favoritos_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historial_interacciones" ADD CONSTRAINT "historial_interacciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversaciones" ADD CONSTRAINT "conversaciones_asignado_a_fkey" FOREIGN KEY ("asignado_a") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_conversacion_id_fkey" FOREIGN KEY ("conversacion_id") REFERENCES "conversaciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mensajes" ADD CONSTRAINT "mensajes_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "respuestas_rapidas" ADD CONSTRAINT "respuestas_rapidas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "configuraciones_ia" ADD CONSTRAINT "configuraciones_ia_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompts" ADD CONSTRAINT "prompts_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "embeddings" ADD CONSTRAINT "embeddings_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_ia" ADD CONSTRAINT "logs_ia_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_ia" ADD CONSTRAINT "logs_ia_mensaje_id_fkey" FOREIGN KEY ("mensaje_id") REFERENCES "mensajes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorias" ADD CONSTRAINT "categorias_categoria_padre_id_fkey" FOREIGN KEY ("categoria_padre_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marcas" ADD CONSTRAINT "marcas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categorias"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_marca_id_fkey" FOREIGN KEY ("marca_id") REFERENCES "marcas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variantes" ADD CONSTRAINT "variantes_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock" ADD CONSTRAINT "stock_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_producto" ADD CONSTRAINT "archivos_producto_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_producto" ADD CONSTRAINT "archivos_producto_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_etiquetas" ADD CONSTRAINT "producto_etiquetas_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "producto_etiquetas" ADD CONSTRAINT "producto_etiquetas_etiqueta_id_fkey" FOREIGN KEY ("etiqueta_id") REFERENCES "etiquetas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_relacionados" ADD CONSTRAINT "productos_relacionados_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos_relacionados" ADD CONSTRAINT "productos_relacionados_relacionado_id_fkey" FOREIGN KEY ("relacionado_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carritos" ADD CONSTRAINT "carritos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_items" ADD CONSTRAINT "carrito_items_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carritos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito_items" ADD CONSTRAINT "carrito_items_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cupones" ADD CONSTRAINT "cupones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "descuentos" ADD CONSTRAINT "descuentos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carritos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_cupon_id_fkey" FOREIGN KEY ("cupon_id") REFERENCES "cupones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direcciones"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_items" ADD CONSTRAINT "pedido_items_variante_id_fkey" FOREIGN KEY ("variante_id") REFERENCES "variantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "estados_pedido" ADD CONSTRAINT "estados_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seguimiento_envios" ADD CONSTRAINT "seguimiento_envios_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transacciones" ADD CONSTRAINT "transacciones_pago_id_fkey" FOREIGN KEY ("pago_id") REFERENCES "pagos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campanas" ADD CONSTRAINT "campanas_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencias" ADD CONSTRAINT "audiencias_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencias" ADD CONSTRAINT "audiencias_campana_id_fkey" FOREIGN KEY ("campana_id") REFERENCES "campanas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencia_clientes" ADD CONSTRAINT "audiencia_clientes_audiencia_id_fkey" FOREIGN KEY ("audiencia_id") REFERENCES "audiencias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audiencia_clientes" ADD CONSTRAINT "audiencia_clientes_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campana_envios" ADD CONSTRAINT "campana_envios_campana_id_fkey" FOREIGN KEY ("campana_id") REFERENCES "campanas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campana_envios" ADD CONSTRAINT "campana_envios_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reclamos" ADD CONSTRAINT "reclamos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reclamos" ADD CONSTRAINT "reclamos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reclamos" ADD CONSTRAINT "reclamos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reclamos" ADD CONSTRAINT "reclamos_asignado_a_fkey" FOREIGN KEY ("asignado_a") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_reclamo" ADD CONSTRAINT "archivos_reclamo_reclamo_id_fkey" FOREIGN KEY ("reclamo_id") REFERENCES "reclamos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos_reclamo" ADD CONSTRAINT "archivos_reclamo_archivo_id_fkey" FOREIGN KEY ("archivo_id") REFERENCES "archivos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "devoluciones" ADD CONSTRAINT "devoluciones_reclamo_id_fkey" FOREIGN KEY ("reclamo_id") REFERENCES "reclamos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos" ADD CONSTRAINT "eventos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_auditoria" ADD CONSTRAINT "logs_auditoria_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "archivos" ADD CONSTRAINT "archivos_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificaciones" ADD CONSTRAINT "notificaciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordatorios" ADD CONSTRAINT "recordatorios_empresa_id_fkey" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recordatorios" ADD CONSTRAINT "recordatorios_carrito_id_fkey" FOREIGN KEY ("carrito_id") REFERENCES "carritos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
