# Plataforma SaaS de IA — MVP
## PASO 5 — Diseño del AI Engine

Este es el módulo que hace que el producto valga lo que vale. Todo lo anterior (DB, endpoints) es infraestructura de soporte; esto es el producto en sí.

---

## 1. Principio de diseño

El AI Engine **no es un endpoint que "le pasa el mensaje a OpenAI"**. Es un orquestador con varias etapas, cada una reemplazable sin tocar las demás:

```
IAiProvider (interfaz)          ← permite cambiar OpenAI por otro modelo sin tocar el resto
IContextBuilder                 ← arma el contexto (memoria + catálogo relevante)
IFunctionExecutor                ← ejecuta las acciones que la IA decide tomar
IConversationOrchestrator        ← coordina todo el flujo
```

Esto es lo que en la visión del proyecto se llama "arquitectura preparada para agentes especializados y AI Gateway multi-modelo": en el MVP hay un solo provider y un solo "agente" (ventas + soporte combinado), pero la interfaz ya permite después tener `AgenteVentas`, `AgenteSoporte`, `AgenteCobranzas` como implementaciones separadas de una misma interfaz `IAgente`.

---

## 2. Flujo completo: de mensaje entrante a respuesta

```
1. Webhook (WhatsApp/Instagram) recibe mensaje crudo
       ↓
2. IngestService:
   - Identifica Empresa (por número de WA / cuenta de IG)
   - Identifica o crea Cliente (por teléfono/psid)
   - Identifica o crea Conversacion (abre una si no hay una "ABIERTA")
   - Guarda el Mensaje (emisor=CLIENTE)
   - Encola job "process-message" en BullMQ (cola por empresa, para no
     mezclar carga y poder priorizar/pausar por tenant)
       ↓
3. Worker "process-message" (ConversationOrchestrator.handle):

   a) Chequea ConfiguracionIA.condicionesHandoffJson
      → si ya está en modo HANDOFF (humano tomó la conversación), NO responde con IA,
        solo notifica al agente asignado.

   b) ContextBuilder.build(conversacionId):
      - Últimos N mensajes de la conversación (memoria de corto plazo)
      - Datos estructurados del Cliente (memoria de preferencias:
        talle, color, marca, presupuesto, dirección, método de pago preferido)
      - Búsqueda de productos relevante SOLO si la IA decide llamar
        a buscar_productos (no se precarga todo el catálogo en el prompt —
        no escala y es carísimo en tokens)
      - Prompt de tipo SYSTEM activo de la empresa + reglas de negocio

   c) PromptAssembler.assemble(contexto):
      Arma el array de mensajes para la API de OpenAI:
      [ system, ...historial_reciente, mensaje_nuevo_del_cliente ]

   d) AiProvider.generarRespuesta(mensajes, funcionesDisponibles):
      Llama a OpenAI con function calling habilitado.
      Puede devolver: (i) texto directo, o (ii) una o más "tool calls"

   e) Si hay tool calls → FunctionExecutor las ejecuta una por una
      (ver §4), y el resultado se vuelve a mandar al modelo para que
      arme la respuesta final en lenguaje natural (loop de function
      calling estándar de OpenAI, máx. 3 iteraciones por mensaje
      para evitar loops infinitos y controlar costo)

   f) Respuesta final en texto natural → se guarda como Mensaje (emisor=IA)
      y se envía por el canal correspondiente (WhatsApp/Instagram/Storefront)

   g) MemoryUpdater (async, no bloquea la respuesta):
      Analiza el intercambio y actualiza campos estructurados del Cliente
      si detectó preferencias nuevas (ej: mencionó que usa talle M)

   h) LogIA: guarda prompt enviado, tokens, costo, latencia, función llamada
       ↓
4. Evento "message.processed" emitido → Analytics
```

---

## 3. Prompt del sistema (estructura, no contenido fijo)

El `Prompt` tipo `SYSTEM` de cada empresa se arma combinando una **plantilla base del sistema** (fija, mejorada con el tiempo) con **variables de la empresa**:

```
[PLANTILLA BASE - igual para todas las empresas]
Sos un asesor comercial humano, no un bot. Nunca digas que sos una IA.
Nunca inventes información que no tengas: si no sabés algo, preguntalo
o derivá a un humano. Mantené un tono {{tono}}. Tu objetivo es vender,
resolver dudas y generar confianza, no solo responder preguntas.

[VARIABLES POR EMPRESA - desde ConfiguracionIA y Empresa]
Trabajás para {{nombreEmpresa}}, un negocio de {{rubro}}.
Horario de atención: {{horarioAtencion}}.
Reglas específicas de este negocio: {{reglasNegocioJson}}.

[INSTRUCCIONES DE HERRAMIENTAS - fijas]
Tenés acceso a funciones para buscar productos, consultar stock, crear
pedidos, consultar el estado de un pedido, y crear reclamos. Usalas
cuando el cliente lo requiera, no inventes datos de stock o precios.

[CONDICIONES DE HANDOFF - desde ConfiguracionIA]
Derivá a un humano si: {{condicionesHandoffJson}}
(ejemplos por defecto: el cliente pide hablar con una persona,
hay una queja grave, se detecta intención de cancelar una compra grande)
```

Esto es lo que se edita desde `/empresa/prompts` y `/empresa/configuracion-ia` en el panel — el mismo motor sirve para una veterinaria o una ferretería solo cambiando estas variables, sin tocar código ni la plantilla base.

---

## 4. Function calling — contrato de cada función (MVP)

Cada función se define como tool de OpenAI con JSON Schema, y tiene un handler en `FunctionExecutor` que llama al servicio de negocio correspondiente (los mismos servicios que usan los endpoints REST del Paso 4 — no hay lógica duplicada).

| Función | Parámetros | Servicio invocado | Devuelve al modelo |
|---|---|---|---|
| `buscar_productos` | `query, categoria?, precioMax?` | `CatalogoService.buscar()` | Lista acotada (máx. 5) con nombre, precio, stock resumido |
| `consultar_stock` | `productoId, varianteId?` | `CatalogoService.stock()` | Cantidad disponible por variante |
| `agregar_al_carrito` | `clienteId, varianteId, cantidad` | `CarritoService.agregarItem()` | Carrito actualizado |
| `crear_pedido` | `clienteId, direccionId?` | `PedidosService.crearDesdeCarrito()` | Número de pedido + total |
| `consultar_estado_pedido` | `numeroPedido` | `PedidosService.estado()` | Estado actual + historial resumido |
| `crear_reclamo` | `clienteId, pedidoId?, descripcion` | `ReclamosService.crear()` | ID de reclamo creado |
| `derivar_a_humano` | `motivo` | `ConversacionesService.marcarHandoff()` | Confirmación (y dispara `Notificacion` al agente) |

**Regla de oro:** el modelo nunca calcula precios, nunca inventa stock, nunca arma el total de un pedido — todo eso lo hace el backend determinístico. La IA solo decide *qué función llamar y con qué argumentos*; los números siempre salen de la base de datos.

---

## 5. Memoria: qué se recuerda y cómo

**Corto plazo (dentro de la conversación activa):** últimos N mensajes (configurable, MVP: 20) se mandan completos en cada llamada.

**Largo plazo (entre conversaciones, persistente):** campos estructurados en `Cliente` (`talleP`, `colorPreferido`, `marcaPreferida`, `presupuestoEstimado`, `metodoPagoPreferido`, `notasIA`). Estos **sí** se inyectan siempre en el contexto, sin importar cuán vieja sea la conversación, porque son datos compactos (pocos tokens) y de alto valor comercial ("recordá que la vez pasada el cliente pidió talle M").

**Lo que el MVP NO hace todavía:** buscar semánticamente en *todo* el historial completo de conversaciones pasadas vía embeddings (eso es RAG de conversaciones, Fase 2 — la tabla `Embedding` con `entidadTipo='conversacion'` queda preparada para esto).

---

## 6. Costos y control

- Cada llamada a OpenAI se registra en `LogIA` con tokens y costo estimado (según pricing del modelo usado, tabla de precios en config).
- `ConfiguracionIA.maxTokens` limita el largo de respuesta por empresa (control de costo por plan de suscripción).
- El dashboard `/dashboard/ia` (Paso 4) lee de acá directamente — es también el dato que usás comercialmente para justificar el precio de la suscripción frente al cliente ("tu IA atendió 340 conversaciones este mes por $X de costo de OpenAI").

---

## 7. Manejo de errores y límites

- Si OpenAI falla (timeout, rate limit) → reintento automático (1 vez) vía BullMQ, y si vuelve a fallar → mensaje de fallback ("Ya te contesto, dame un segundo" + reintento en cola) en vez de dejar al cliente sin respuesta.
- Límite de 3 iteraciones de function calling por mensaje: si la IA no logra resolver en 3 pasos, se fuerza `derivar_a_humano` automáticamente.
- Rate limiting por empresa (además del global de la API) para que un tenant no consuma el presupuesto de tokens de otro.

---

## 8. Estructura de carpetas del módulo (referencia para cuando escribamos código)

```
apps/api/src/modules/ai-engine/
├── ai-engine.module.ts
├── providers/
│   ├── ai-provider.interface.ts       (IAiProvider)
│   └── openai.provider.ts             (implementación)
├── orchestrator/
│   └── conversation-orchestrator.service.ts
├── context/
│   └── context-builder.service.ts
├── prompts/
│   └── prompt-assembler.service.ts
├── functions/
│   ├── function-executor.service.ts
│   └── definitions/                   (JSON schema de cada tool)
├── memory/
│   └── memory-updater.service.ts
└── processors/
    └── process-message.processor.ts   (worker BullMQ)
```

---

## Próximo paso

**Paso 6: memoria y sistema de function calling en detalle técnico** ya quedó cubierto en gran parte acá — lo que falta específicamente de tu lista original es:

- **Paso 6 (redefinido): Panel administrador** — wireframe/estructura de pantallas (dashboard, productos, conversaciones, pedidos, configuración IA) para que la demo se vea profesional.
- O si preferís, pasamos directo a **escribir código real** del backend (empezando por Identity + Auth, que es la base de todo lo demás).

¿Cómo seguimos?
