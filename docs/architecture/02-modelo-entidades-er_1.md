# Plataforma SaaS de IA para Atención al Cliente y Ventas
## PASO 2 — Modelo de Entidades y Diagrama ER

Convención: toda tabla (excepto catálogos globales del sistema, si los hubiera) incluye `empresa_id` para aislar tenants, más `id (uuid)`, `created_at`, `updated_at`, `deleted_at` (soft delete). Estos campos comunes no se repiten en cada tabla para no saturar el documento; se dan por asumidos.

---

## 1. Identity (empresas, usuarios, permisos)

```
Empresa
 ├─ id, nombre, slug, rubro, logo_url, telefono_whatsapp,
 │  instagram_account_id, moneda, timezone, plan, estado, config_json
 │
Usuario                         (usuario interno: admin, vendedor, soporte)
 ├─ id, empresa_id → Empresa, nombre, email, password_hash,
 │  avatar_url, estado, ultimo_login
 │
Rol
 ├─ id, empresa_id → Empresa, nombre, descripcion, es_sistema
 │
Permiso
 ├─ id, codigo (ej. "productos.crear"), descripcion, modulo
 │
UsuarioRol (N:N)
 ├─ usuario_id → Usuario, rol_id → Rol
 │
RolPermiso (N:N)
 ├─ rol_id → Rol, permiso_id → Permiso
```

**Relaciones clave:** Empresa 1—N Usuario. Usuario N—N Rol. Rol N—N Permiso.

---

## 2. CRM (clientes y memoria)

```
Cliente
 ├─ id, empresa_id → Empresa, nombre, telefono, email,
 │  canal_origen (whatsapp/instagram/web), es_frecuente,
 │  presupuesto_estimado, talle_preferido, color_preferido,
 │  marca_preferida, metodo_pago_preferido, notas_ia
 │
Direccion
 ├─ id, cliente_id → Cliente, calle, numero, ciudad, provincia,
 │  cp, referencia, es_principal
 │
Etiqueta
 ├─ id, empresa_id → Empresa, nombre, color
 │
ClienteEtiqueta (N:N)
 ├─ cliente_id → Cliente, etiqueta_id → Etiqueta
 │
Favorito
 ├─ id, cliente_id → Cliente, producto_id → Producto, created_at
 │
HistorialInteraccion             (línea de tiempo consolidada)
 ├─ id, cliente_id → Cliente, tipo (consulta/compra/reclamo/campaña),
 │  referencia_id, descripcion
```

**Nota de memoria:** los campos "preferidos" en `Cliente` son la memoria estructurada de corto acceso (se leen en cada prompt sin necesidad de RAG). El historial completo vive en `Conversaciones`/`Mensajes` y se resume periódicamente por un worker hacia estos campos.

---

## 3. Conversations (canales y mensajes)

```
Conversacion
 ├─ id, empresa_id → Empresa, cliente_id → Cliente,
 │  canal (whatsapp/instagram/web), estado (abierta/cerrada/handoff),
 │  asignado_a → Usuario (nullable), ultimo_mensaje_at
 │
Mensaje
 ├─ id, conversacion_id → Conversacion, emisor (cliente/ia/humano),
 │  tipo (texto/imagen/audio/video/documento), contenido,
 │  archivo_id → Archivo (nullable), tokens_usados, costo_usd,
 │  intencion_detectada, sentimiento
 │
RespuestaRapida
 ├─ id, empresa_id → Empresa, atajo, contenido
```

**Relaciones clave:** Cliente 1—N Conversacion 1—N Mensaje. Cada Mensaje puede referenciar un Archivo (multimedia).

---

## 4. AI Engine (configuración, prompts, memoria vectorial)

```
ConfiguracionIA
 ├─ id, empresa_id → Empresa, tono, reglas_negocio_json,
 │  modelo_openai, temperature, max_tokens, horario_atencion_json,
 │  condiciones_handoff_json
 │
Prompt
 ├─ id, empresa_id → Empresa, tipo (system/ventas/soporte/reclamos),
 │  contenido, version, activo
 │
Embedding
 ├─ id, empresa_id → Empresa, entidad_tipo (producto/faq/politica),
 │  entidad_id, contenido_fuente, vector (pgvector)
 │
LogIA
 ├─ id, empresa_id → Empresa, mensaje_id → Mensaje,
 │  prompt_enviado, respuesta_cruda, funcion_llamada,
 │  tokens_prompt, tokens_completion, costo_usd, latencia_ms
```

**Relaciones clave:** Producto (y otras entidades indexables) 1—N Embedding vía `entidad_tipo` + `entidad_id` (relación polimórfica, no FK estricta, para mantener genérico el indexado).

---

## 5. Catalog (productos)

```
Categoria
 ├─ id, empresa_id → Empresa, nombre, categoria_padre_id → Categoria (self)
 │
Marca
 ├─ id, empresa_id → Empresa, nombre, logo_url
 │
Producto
 ├─ id, empresa_id → Empresa, categoria_id → Categoria, marca_id → Marca,
 │  sku, codigo_barras, nombre, descripcion, precio, costo,
 │  peso, seo_slug, seo_meta, estado, destacado
 │
Variante
 ├─ id, producto_id → Producto, color, talle, sku_variante,
 │  precio_adicional, imagen_url
 │
Stock
 ├─ id, variante_id → Variante (o producto_id si no hay variantes),
 │  cantidad, deposito, stock_minimo
 │
ArchivoProducto
 ├─ id, producto_id → Producto, archivo_id → Archivo, tipo (imagen/video/pdf), orden
 │
ProductoEtiqueta (N:N)
 ├─ producto_id → Producto, etiqueta_id → Etiqueta
 │
ProductoRelacionado
 ├─ id, producto_id → Producto, relacionado_id → Producto,
 │  tipo (similar/complementario/combo)
```

**Relaciones clave:** Categoria es jerárquica (self-relation). Producto 1—N Variante 1—N Stock. Producto N—N Producto (relacionados, self-relation vía tabla intermedia).

---

## 6. Sales / Orders (carrito, pedidos, cupones)

```
Carrito
 ├─ id, empresa_id → Empresa, cliente_id → Cliente, estado (activo/abandonado/convertido),
 │  ultima_actividad_at
 │
CarritoItem
 ├─ id, carrito_id → Carrito, variante_id → Variante, cantidad, precio_unitario
 │
Cupon
 ├─ id, empresa_id → Empresa, codigo, tipo (porcentaje/monto_fijo),
 │  valor, fecha_inicio, fecha_fin, usos_maximos, usos_actuales
 │
Descuento                        (reglas automáticas, sin código)
 ├─ id, empresa_id → Empresa, nombre, condicion_json, valor
 │
Pedido
 ├─ id, empresa_id → Empresa, cliente_id → Cliente, carrito_id → Carrito (nullable),
 │  numero_pedido, subtotal, descuento_total, envio, total,
 │  cupon_id → Cupon (nullable), direccion_id → Direccion, estado_actual_id → EstadoPedido
 │
PedidoItem
 ├─ id, pedido_id → Pedido, variante_id → Variante, cantidad,
 │  precio_unitario, subtotal
 │
EstadoPedido                     (catálogo de estados + historial)
 ├─ id, pedido_id → Pedido, estado (pendiente/preparando/empaquetado/
 │  despachado/en_viaje/entregado/cancelado/devuelto),
 │  comentario, usuario_id → Usuario (nullable), created_at
 │
SeguimientoEnvio
 ├─ id, pedido_id → Pedido, transportista, numero_tracking, url_tracking
```

**Relaciones clave:** Carrito 1—N CarritoItem. Carrito 1—1 Pedido (al convertirse). Pedido 1—N PedidoItem. Pedido 1—N EstadoPedido (historial completo de cambios, no solo el estado actual).

---

## 7. Payments

```
Pago
 ├─ id, empresa_id → Empresa, pedido_id → Pedido, proveedor (mercadopago/stripe),
 │  monto, moneda, estado (pendiente/aprobado/rechazado/reembolsado),
 │  link_pago, qr_url, external_id
 │
Transaccion                      (log crudo de webhooks)
 ├─ id, pago_id → Pago, payload_json, tipo_evento, procesado
```

---

## 8. Marketing

```
Campana
 ├─ id, empresa_id → Empresa, nombre, canal (whatsapp/instagram/email),
 │  contenido_template, variables_json, estado, fecha_programada
 │
Audiencia
 ├─ id, empresa_id → Empresa, nombre, criterio_json
 │  (nuevos/frecuentes/inactivos/interesados/compradores/no_compradores)
 │
AudienciaCliente (N:N, materializada al momento de envío)
 ├─ audiencia_id → Audiencia, cliente_id → Cliente
 │
CampanaEnvio
 ├─ id, campana_id → Campana, cliente_id → Cliente, estado_envio,
 │  abierto, click, conversion, enviado_at
```

**Relaciones clave:** Campana N—N Cliente vía Audiencia + CampanaEnvio (permite trackear CTR/conversión por cliente y campaña).

---

## 9. Support (reclamos y devoluciones)

```
Reclamo
 ├─ id, empresa_id → Empresa, cliente_id → Cliente, pedido_id → Pedido (nullable),
 │  tipo, descripcion, estado, asignado_a → Usuario, prioridad
 │
ArchivoReclamo
 ├─ id, reclamo_id → Reclamo, archivo_id → Archivo, tipo (imagen/video/audio)
 │
Devolucion
 ├─ id, pedido_id → Pedido, reclamo_id → Reclamo (nullable),
 │  motivo, estado, monto_reembolso
```

---

## 10. Analytics / Logs / Files / Notifications (transversales)

```
Evento                            (event sourcing ligero para analítica)
 ├─ id, empresa_id → Empresa, tipo (mensaje_recibido/producto_visto/
 │  carrito_creado/pedido_creado/pago_aprobado/campaña_click...),
 │  entidad_tipo, entidad_id, metadata_json
 │
LogAuditoria
 ├─ id, empresa_id → Empresa, usuario_id → Usuario (nullable),
 │  accion, entidad_tipo, entidad_id, ip, user_agent
 │
Archivo                           (genérico, referenciado por otras tablas)
 ├─ id, empresa_id → Empresa, url, tipo_mime, tamano_bytes, bucket
 │
Notificacion
 ├─ id, empresa_id → Empresa, usuario_id → Usuario, tipo, contenido, leida
 │
Recordatorio                      (recuperación de carrito, seguimientos)
 ├─ id, empresa_id → Empresa, tipo (carrito_abandonado/pedido_pendiente),
 │  referencia_id, ejecutar_at, ejecutado, canal
```

`Evento` es la fuente de datos para el Dashboard/Analítica (embudo de ventas, conversión por canal, etc.) sin necesidad de joins pesados sobre las tablas transaccionales.

---

## 11. Diagrama de relaciones entre módulos (resumen)

```
Empresa ─┬─< Usuario ─< UsuarioRol >─ Rol >─ RolPermiso >─ Permiso
         ├─< Cliente ─┬─< Direccion
         │            ├─< Conversacion ─< Mensaje
         │            ├─< Carrito ─< CarritoItem >─ Variante
         │            ├─< Pedido ─< PedidoItem >─ Variante
         │            │           ├─< EstadoPedido
         │            │           ├─< Pago ─< Transaccion
         │            │           └─< SeguimientoEnvio
         │            ├─< Reclamo ─< ArchivoReclamo
         │            └─< Favorito >─ Producto
         ├─< Categoria (self) ─< Producto >─ Marca
         │                       Producto ─< Variante ─< Stock
         │                       Producto ─< ArchivoProducto >─ Archivo
         │                       Producto ─< Embedding (polimórfico)
         ├─< Campana ─< AudienciaCliente >─ Cliente
         ├─< ConfiguracionIA
         ├─< Prompt
         └─< Evento / LogAuditoria / Notificacion / Recordatorio
```

---

## 12. Decisiones de diseño relevantes

- **Soft delete everywhere:** `deleted_at` en vez de borrar físicamente (requisito de auditoría + recuperación de datos históricos para IA).
- **Historial de estados como tabla propia** (`EstadoPedido`) en vez de un solo campo `estado` en `Pedido`: necesario para trazabilidad y para que la IA responda "¿dónde está mi pedido?" con contexto temporal.
- **Relación polimórfica en `Embedding`**: permite indexar no solo productos sino FAQs, políticas de la empresa, etc., sin crear una tabla de embeddings por entidad.
- **`Evento` como bus de analítica**: desacopla el dashboard de las tablas operativas; los workers escriben eventos, el módulo Analytics solo lee de ahí.
- **Cupon vs Descuento separados**: Cupon requiere código ingresado por el cliente; Descuento se aplica automáticamente por reglas (ej. "3x2 en categoría X").

---

## Próximo paso

**Paso 3: Esquema de base de datos completo en Prisma** (`schema.prisma` real, con todos los modelos, tipos, índices y relaciones de este documento, listo para generar la migración inicial).

¿Confirmás para seguir con el Paso 3?
