# Ajuste de Alcance — MVP Comercial
## (Reemplaza el enfoque "todo el sistema" por "demo vendible")

---

## 1. Objetivo del MVP

Un SaaS que en una demo de 15 minutos le muestre a un dueño de comercio:

> "Esta IA atiende tus clientes, vende tus productos, gestiona pedidos y ayuda a aumentar tus ventas las 24 horas."

Configurable por empresa (rubro, tono, catálogo, reglas) **sin tocar código**. Vendible por suscripción mensual desde el día 1.

---

## 2. Alcance MVP vs. Post-MVP

El modelo de datos (Paso 3) ya soporta todo esto. Lo que decidimos ahora es **qué módulos tienen lógica de negocio + endpoints + UI en la v1**, y cuáles quedan solo como tablas listas para activar después.

| # | Funcionalidad | Estado en MVP |
|---|---|---|
| 1 | Atención por WhatsApp (Evolution API) | ✅ Build ahora |
| 2 | Atención por Instagram | ✅ Build ahora (mismo motor, canal distinto) |
| 3 | Conversaciones naturales con IA (OpenAI, function calling básico) | ✅ Build ahora |
| 4 | Catálogo con imágenes | ✅ Build ahora |
| 5 | Recomendación de productos | ✅ Versión simple: reglas + "productos relacionados" manuales. **No** embeddings/RAG todavía |
| 6 | Creación de pedidos | ✅ Build ahora |
| 7 | Consulta de estado de pedido | ✅ Build ahora |
| 8 | Gestión básica de reclamos | ✅ Build ahora (sin escalado automático complejo) |
| 9 | Panel administrador | ✅ Build ahora |
| 10 | Gestión de productos desde panel | ✅ Build ahora |
| 11 | Dashboard con métricas básicas | ✅ Build ahora (ventas, conversaciones, pedidos — no embudo avanzado) |
| 12 | Configuración por empresa (rubro/tono/reglas) | ✅ Build ahora — **es el corazón de la propuesta comercial** |
| — | Memoria avanzada del cliente | 🔜 Modelo listo (`Cliente.notasIA`, `HistorialInteraccion`), lógica simplificada en MVP |
| — | RAG con documentos / embeddings | 🔜 Tabla `Embedding` ya existe, sin pipeline de indexado aún |
| — | Recuperación de carritos abandonados | 🔜 Tabla `Recordatorio` ya existe, sin worker activo |
| — | Campañas de marketing | 🔜 Tablas `Campana`/`Audiencia` ya existen, sin motor de envío |
| — | Pagos online (Mercado Pago/Stripe) | 🔜 Tabla `Pago` ya existe. **Decisión:** en el MVP el pedido se cierra con "link de pago manual" o "pagar al recibir" — integración automática de pagos pasa a Fase 2 (evita bloquear la demo con certificaciones de MP/Stripe) |
| — | Agentes especializados / AI Gateway multi-modelo | 🔜 Arquitectura del AI Engine ya aísla el proveedor (ver §4) |
| — | Integraciones Shopify/Tiendanube/ML/ERP | 🔜 Fuera de alcance, catálogo se carga desde el panel |
| — | Voz / multimodalidad | 🔜 Fuera de alcance |
| — | Workflow builder | 🔜 Fuera de alcance |

**Regla general:** ninguna tabla del schema se descarta. Lo que se pospone es servicio/controlador/UI. Esto es intencional: cuando vendas la Fase 2 a un cliente, no migrás datos, solo activás módulos.

---

## 3. Módulos que se construyen en el MVP (de los 14 originales)

```
✅ Identity          (empresas, usuarios, roles — simplificado: 2-3 roles fijos, no editor de permisos)
✅ CRM               (cliente básico + memoria simple, sin segmentación avanzada)
✅ Conversations      (WhatsApp + Instagram)
✅ AI Engine          (system prompt por empresa + function calling básico, sin RAG)
✅ Catalog            (productos, variantes, stock, imágenes)
✅ Sales/Orders       (carrito en memoria de conversación + pedido, sin cupones/descuentos automáticos)
✅ Support            (reclamos simples)
✅ Analytics          (dashboard básico desde tabla Evento)
⏸ Payments           (solo generación de link manual/registro, sin webhook automático)
⏸ Recommender        (reglas estáticas configurables, no motor de embeddings)
⏸ Marketing          (queda en el modelo, sin UI/lógica)
✅ Storefront         (tienda mínima: catálogo + carrito + checkout simple, sin gateway de pago automático)
✅ Admin Panel        (el módulo más importante para la venta — debe verse profesional)
```

---

## 4. Decisión de arquitectura clave para no bloquear el futuro

**AI Provider Adapter:** el AI Engine nunca llama a OpenAI directamente desde los servicios de negocio. Se define una interfaz `IAiProvider` (`generarRespuesta()`, `generarEmbedding()`) con una implementación `OpenAiProvider`. Esto permite en el futuro:
- Agregar otros modelos (Claude, Gemini) sin tocar Sales/Support/etc.
- Convertir esto en el "AI Gateway multi-modelo" mencionado en la visión, simplemente agregando providers.

**Function Calling mínimo en MVP** (las únicas funciones que el modelo puede invocar):
- `buscar_productos(query, filtros)`
- `consultar_stock(producto_id)`
- `crear_pedido(items, cliente_id)`
- `consultar_estado_pedido(numero_pedido)`
- `crear_reclamo(pedido_id, descripcion)`
- `derivar_a_humano(motivo)`

El resto de funciones (aplicar cupón, generar campaña, etc.) se agregan después sin cambiar el patrón.

**Configuración por empresa como diferenciador comercial:** todo lo que hace que el mismo código sirva para una veterinaria o una perfumería vive en:
- `Empresa.rubro`, `ConfiguracionIA` (tono, reglas, horarios, condiciones de handoff)
- `Prompt` (system prompt versionado por empresa)
- El catálogo (`Producto`/`Categoria`) cargado desde el panel

Esto es lo que hay que dejar **impecable** en el panel admin, porque es lo que se muestra en cada demo comercial: "cambiás 3 cosas y ya está adaptado a tu rubro."

---

## 5. Impacto en lo ya avanzado

- **Paso 1 (Arquitectura general):** sin cambios, sigue siendo válida.
- **Paso 2 (Modelo de entidades):** sin cambios.
- **Paso 3 (`schema.prisma`):** sin cambios — se construyó ya pensando en modularidad.
- **Paso 4 (Endpoints, a continuación):** se redefine para cubrir **solo los módulos marcados ✅** arriba. Los módulos ⏸ se documentan como "preparados, no implementados" para que quede explícito en el código (útil también para vender la roadmap al cliente).

---

## Próximo paso

**Paso 4 (redefinido): Diseño de endpoints REST del MVP** — Identity, CRM, Conversations, AI Engine, Catalog, Sales/Orders, Support, Analytics, Storefront/Admin. Con verbos, rutas, DTOs de entrada/salida y reglas de autorización.

¿Confirmás para seguir?
