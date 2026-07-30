# Plataforma SaaS de IA para Atención al Cliente y Ventas
## PASO 1 — Arquitectura General

---

## 1. Visión del sistema

Plataforma **multi-tenant** (multi-empresa): una sola instancia de backend sirve a N empresas distintas (tienda de ropa, veterinaria, ferretería, etc.). Cada empresa tiene:

- Su propia configuración de IA (tono, reglas, catálogo, prompts).
- Su propio catálogo, clientes, conversaciones, pedidos.
- Aislamiento total de datos (row-level por `empresa_id` en todas las tablas).

El "cerebro" (motor de IA, motor de ventas, motor de recomendación) es genérico y agnóstico del rubro. Lo que cambia entre negocios es **solo data**: catálogo + configuración, nunca código.

---

## 2. Arquitectura de alto nivel

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTES FINALES                        │
│        WhatsApp        Instagram        Tienda Online (Web)     │
└───────────┬─────────────────┬──────────────────┬────────────────┘
            │                 │                  │
      ┌─────▼─────┐    ┌──────▼──────┐    ┌──────▼──────┐
      │ Evolution  │    │  Instagram   │    │  Next.js     │
      │ API (WA)   │    │  Messaging   │    │  Storefront  │
      └─────┬─────┘    └──────┬──────┘    └──────┬──────┘
            │                 │                  │
            └────────┬────────┴──────────┬───────┘
                      │                   │
              ┌───────▼───────────────────▼───────┐
              │        API GATEWAY (NestJS)        │
              │   Auth · Rate limit · Validación   │
              └───────┬─────────────────────────────┘
                      │
   ┌──────────────────┼───────────────────────────────────┐
   │                  │                                    │
┌──▼────────┐  ┌──────▼───────┐  ┌──────────────┐  ┌───────▼──────┐
│  Módulo    │  │   Módulo IA   │  │  Módulo      │  │  Módulo      │
│  Core      │  │  (Conversac., │  │  Ecommerce   │  │  Marketing   │
│ (empresas, │  │  Memoria,     │  │ (Catálogo,   │  │ (Campañas,   │
│  usuarios, │  │  Recomendador,│  │  Pedidos,    │  │  Audiencias) │
│  clientes) │  │  Ventas)      │  │  Pagos)      │  │              │
└──────┬─────┘  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘
       │               │                  │                 │
       └───────────────┴─────────┬────────┴─────────────────┘
                                  │
                  ┌───────────────▼────────────────┐
                  │        Capa de Datos            │
                  │  PostgreSQL + pgvector           │
                  │  Redis (cache/colas)             │
                  │  MinIO (S3 - archivos)           │
                  └───────────────┬────────────────┘
                                  │
                  ┌───────────────▼────────────────┐
                  │   Workers (BullMQ)               │
                  │  - Envío de mensajes             │
                  │  - Recuperación de carritos       │
                  │  - Campañas programadas           │
                  │  - Embeddings / indexado          │
                  │  - Webhooks de pago               │
                  └──────────────────────────────────┘
```

---

## 3. Módulos del sistema (Bounded Contexts)

| Módulo | Responsabilidad |
|---|---|
| **Identity** | Empresas, usuarios internos, roles, permisos (RBAC), autenticación JWT |
| **CRM** | Clientes finales, historial, memoria de preferencias, etiquetas, favoritos |
| **Conversations** | Conversaciones, mensajes, canales (WA/IG/Web), estado de handoff humano |
| **AI Engine** | Orquestación del agente: intención, contexto, memoria, prompts, function calling |
| **Catalog** | Productos, variantes, categorías, marcas, stock, archivos multimedia |
| **Sales / Orders** | Carritos, pedidos, estados, seguimiento, cupones |
| **Payments** | Integración Mercado Pago / Stripe, webhooks, transacciones |
| **Recommender** | Motor de cross-sell / up-sell (reglas + embeddings de similitud) |
| **Marketing** | Campañas, audiencias, segmentación, envíos masivos, métricas |
| **Support** | Reclamos, devoluciones, adjuntos, asignación, escalado |
| **Analytics** | Embudo de ventas, KPIs, dashboard, costos de IA |
| **Notifications** | Recordatorios de carrito, notificaciones internas, email/WA transaccional |
| **Storefront** | Tienda online pública (Next.js) que consume la API |
| **Admin Panel** | Panel de administración (Next.js) |

Cada módulo en NestJS = un **feature module** independiente (`libs/` o `apps/` en un monorepo), con su propio `Controller`, `Service`, `Repository`, `DTOs`. Comunicación entre módulos vía eventos internos (Event Emitter / colas BullMQ), no llamadas directas cruzadas, para permitir migrar a microservicios después sin reescritura.

---

## 4. Estructura de carpetas propuesta (monorepo)

```
saas-ai-commerce/
├── apps/
│   ├── api/                  # Backend NestJS (monolito modular)
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── identity/
│   │   │   │   ├── crm/
│   │   │   │   ├── conversations/
│   │   │   │   ├── ai-engine/
│   │   │   │   ├── catalog/
│   │   │   │   ├── sales/
│   │   │   │   ├── payments/
│   │   │   │   ├── recommender/
│   │   │   │   ├── marketing/
│   │   │   │   ├── support/
│   │   │   │   ├── analytics/
│   │   │   │   └── notifications/
│   │   │   ├── common/        # guards, interceptors, pipes, decorators
│   │   │   ├── config/
│   │   │   ├── infra/         # prisma, redis, s3, queue clients
│   │   │   └── main.ts
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   └── migrations/
│   │   └── test/
│   ├── admin-panel/          # Next.js (panel administrador)
│   └── storefront/           # Next.js (tienda online pública)
├── packages/
│   ├── shared-types/          # DTOs/tipos compartidos front-back
│   ├── ui/                    # Componentes Shadcn compartidos
│   └── config/                # eslint, tsconfig, tailwind compartidos
├── infra/
│   ├── docker/
│   │   ├── Dockerfile.api
│   │   ├── Dockerfile.admin
│   │   ├── Dockerfile.storefront
│   │   └── nginx/
│   ├── docker-compose.yml
│   └── docker-compose.prod.yml
├── .github/workflows/
├── docs/
│   └── architecture/          # estos documentos de diseño
└── README.md
```

---

## 5. Multi-tenancy: decisión de diseño

**Estrategia elegida: single database, shared schema, aislamiento por `empresa_id`.**

Razones:
- Más simple de operar y escalar horizontalmente para un SaaS con muchos tenants pequeños/medianos.
- Permite analítica cross-tenant para el propio SaaS (billing, uso de IA).
- Row-Level Security de PostgreSQL como segunda capa de defensa además del filtro por `empresa_id` en Prisma (middleware que inyecta el filtro automáticamente en cada query).

Si un cliente enterprise necesita aislamiento físico, se migra a "database-per-tenant" sin cambiar el modelo de dominio (es un detalle de infraestructura).

---

## 6. Flujo conversacional (alto nivel)

```
Mensaje entrante (WA/IG/Web)
   → Webhook recibe evento
   → Identifica empresa (por número/cuenta) y cliente (por teléfono/ID)
   → Guarda mensaje en Conversations
   → Encola job en BullMQ: "process-message"
   → Worker AI Engine:
        1. Recupera historial reciente + memoria del cliente
        2. Recupera contexto relevante (RAG sobre catálogo vía pgvector)
        3. Arma prompt (system + reglas de empresa + contexto + historial)
        4. Llama a OpenAI (con function calling: buscar_producto,
           crear_pedido, generar_link_pago, consultar_pedido, etc.)
        5. Ejecuta función solicitada si corresponde (Sales/Catalog/Payments)
        6. Genera respuesta en lenguaje natural
        7. Envía respuesta por el mismo canal
        8. Actualiza memoria del cliente (preferencias detectadas)
   → Emite evento "message.processed" → Analytics, Notifications
```

Esto es el resumen; el diseño detallado de prompts, function calling y memoria lo hacemos en el paso dedicado a IA (paso 7-9 de tu lista).

---

## 7. Próximos pasos (siguiendo tu orden)

1. ✅ Arquitectura general (este documento)
2. ⬜ Modelo de entidades (diagrama ER conceptual)
3. ⬜ Esquema de base de datos completo (Prisma schema)
4. ⬜ Diseño de endpoints (API REST + Swagger)
5. ⬜ Flujos detallados (ventas, carrito, recuperación, reclamos)
6. ⬜ Diseño del AI Engine (function calling, RAG, orquestación)
7. ⬜ Prompts internos (system prompts por rol/rubro)
8. ⬜ Diseño de memoria del cliente
9. ⬜ Diagramas de comunicación entre módulos/eventos
10. ⬜ Sistema de permisos (RBAC detallado)
11. ⬜ Diseño del panel administrador (wireframes/estructura)
12. ⬜ Diseño de la tienda online (wireframes/estructura)

**¿Confirmás este enfoque general para pasar al Paso 2 (modelo de entidades y diagrama ER)?** Si querés ajustar algo de esta arquitectura (por ejemplo microservicios desde el inicio, u otra estrategia de multi-tenancy), decímelo antes de seguir.