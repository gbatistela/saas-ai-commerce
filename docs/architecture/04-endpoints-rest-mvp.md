# Plataforma SaaS de IA — MVP
## PASO 4 — Endpoints REST

Convenciones generales:
- Prefijo global: `/api/v1`
- Autenticación: `Authorization: Bearer <jwt>` salvo endpoints marcados **Público**.
- Multi-tenant: el `empresa_id` **nunca** viaja en el body ni en la URL para endpoints autenticados — se obtiene del JWT (`req.user.empresaId`). Evita que un usuario de una empresa toque datos de otra por error o manipulación.
- Paginación estándar en listados: `?page=1&limit=20&sort=campo&order=asc`
- Respuesta de error estándar: `{ statusCode, message, error, timestamp, path }`
- Documentado automáticamente con Swagger en `/api/docs` (NestJS `@nestjs/swagger`).
- Roles MVP: `OWNER` (dueño de la empresa), `ADMIN` (gestiona todo salvo billing), `AGENTE` (solo conversaciones/pedidos/reclamos, sin acceso a config ni catálogo).

---

## 1. Auth (Identity)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/auth/register` | Público | Crea Empresa + Usuario OWNER inicial (onboarding self-service) |
| POST | `/auth/login` | Público | Devuelve `accessToken` + `refreshToken` |
| POST | `/auth/refresh` | Público (requiere refreshToken válido) | Renueva `accessToken` |
| POST | `/auth/logout` | Autenticado | Invalida refresh token |
| GET | `/auth/me` | Autenticado | Datos del usuario logueado + empresa |

**DTO `RegisterDto`:** `nombreEmpresa, rubro, nombreUsuario, email, password`
**DTO `LoginDto`:** `email, password`

---

## 2. Empresas / Configuración

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/empresa` | OWNER, ADMIN | Datos de la empresa propia |
| PATCH | `/empresa` | OWNER | Editar nombre, logo, rubro, moneda, timezone |
| GET | `/empresa/configuracion-ia` | OWNER, ADMIN | Config actual del agente IA |
| PUT | `/empresa/configuracion-ia` | OWNER, ADMIN | Actualiza tono, reglas, horarios, condiciones de handoff, modelo |
| GET | `/empresa/prompts` | OWNER, ADMIN | Lista prompts (system/ventas/soporte/reclamos) |
| PUT | `/empresa/prompts/:tipo` | OWNER, ADMIN | Actualiza el prompt activo de ese tipo (crea nueva versión) |

**DTO `ConfiguracionIaDto`:** `tono, reglasNegocioJson, modeloOpenai, temperature, maxTokens, horarioAtencionJson, condicionesHandoffJson`

Este bloque es el más importante comercialmente: es lo que se edita en la demo para "adaptar la IA al rubro" en vivo.

---

## 3. Usuarios internos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/usuarios` | OWNER, ADMIN | Lista usuarios de la empresa |
| POST | `/usuarios` | OWNER | Invita/crea un usuario (agente o admin) |
| PATCH | `/usuarios/:id` | OWNER | Editar rol/estado |
| DELETE | `/usuarios/:id` | OWNER | Desactivar (soft delete) |

*(MVP: roles fijos por enum simple, sin editor de permisos granular — eso es Fase 2, tabla `Permiso` ya está lista.)*

---

## 4. Catálogo

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/productos` | Autenticado / **Público** vía storefront | Lista con filtros: `categoria, marca, texto, estado` |
| GET | `/productos/:id` | Autenticado / Público | Detalle con variantes, stock, archivos |
| POST | `/productos` | OWNER, ADMIN | Crear producto |
| PATCH | `/productos/:id` | OWNER, ADMIN | Editar producto |
| DELETE | `/productos/:id` | OWNER, ADMIN | Soft delete |
| POST | `/productos/:id/variantes` | OWNER, ADMIN | Agregar variante (color/talle) |
| PATCH | `/variantes/:id` | OWNER, ADMIN | Editar variante |
| PATCH | `/variantes/:id/stock` | OWNER, ADMIN | Ajustar stock |
| POST | `/productos/:id/archivos` | OWNER, ADMIN | Subir imagen/video/PDF (multipart → MinIO) |
| DELETE | `/archivos/:id` | OWNER, ADMIN | Eliminar archivo |
| GET | `/categorias` | Autenticado / Público | Árbol de categorías |
| POST | `/categorias` | OWNER, ADMIN | Crear categoría |
| PATCH | `/categorias/:id` | OWNER, ADMIN | Editar/mover en el árbol |
| GET | `/marcas` | Autenticado / Público | Listar marcas |
| POST | `/marcas` | OWNER, ADMIN | Crear marca |
| POST | `/productos/:id/relacionados` | OWNER, ADMIN | Vincular producto relacionado (similar/complementario/combo) — base del recomendador simple del MVP |

**DTO `CreateProductoDto`:** `nombre, sku, descripcion, precio, costo, categoriaId, marcaId, peso, destacado`

---

## 5. Clientes (CRM)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/clientes` | OWNER, ADMIN, AGENTE | Lista con filtros: `nombre, telefono, esFrecuente` |
| GET | `/clientes/:id` | OWNER, ADMIN, AGENTE | Perfil completo: datos, memoria, historial, pedidos |
| PATCH | `/clientes/:id` | OWNER, ADMIN, AGENTE | Editar datos/preferencias manualmente |
| POST | `/clientes/:id/direcciones` | AGENTE+ | Agregar dirección |
| GET | `/clientes/:id/historial` | OWNER, ADMIN, AGENTE | Timeline de interacciones |

*(El alta de clientes normalmente la hace el sistema automáticamente al llegar el primer mensaje por WhatsApp/Instagram — no hay endpoint de "crear cliente" manual como flujo principal, aunque puede existir para carga manual desde el panel.)*

---

## 6. Conversaciones y mensajes

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/conversaciones` | OWNER, ADMIN, AGENTE | Lista con filtros: `estado, canal, asignadoA` |
| GET | `/conversaciones/:id` | OWNER, ADMIN, AGENTE | Detalle + mensajes (paginado) |
| POST | `/conversaciones/:id/mensajes` | OWNER, ADMIN, AGENTE | Enviar mensaje manual (toma control humano) |
| PATCH | `/conversaciones/:id/asignar` | OWNER, ADMIN | Asignar a un agente |
| PATCH | `/conversaciones/:id/estado` | OWNER, ADMIN, AGENTE | Cerrar / reabrir / marcar handoff |
| GET | `/respuestas-rapidas` | OWNER, ADMIN, AGENTE | Listar atajos |
| POST | `/respuestas-rapidas` | OWNER, ADMIN | Crear atajo |

### Webhooks entrantes (canal → sistema)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/webhooks/whatsapp` | Público (validado por firma/token de Evolution API) | Recibe mensajes entrantes de WhatsApp |
| POST | `/webhooks/instagram` | Público (validado por token de Meta) | Recibe mensajes entrantes de Instagram |

Estos dos son el punto de entrada real del agente: reciben el mensaje, identifican empresa+cliente, encolan el job `process-message` en BullMQ (ver Paso de AI Engine).

---

## 7. Carrito y pedidos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/carritos/cliente/:clienteId` | Interno / AGENTE+ | Carrito activo de un cliente |
| POST | `/carritos/:id/items` | Interno (usado por AI Engine y Storefront) | Agregar item |
| PATCH | `/carritos/:id/items/:itemId` | Interno | Cambiar cantidad |
| DELETE | `/carritos/:id/items/:itemId` | Interno | Quitar item |
| POST | `/pedidos` | Interno (AI Engine / Storefront checkout) | Crear pedido desde carrito |
| GET | `/pedidos` | OWNER, ADMIN, AGENTE | Lista con filtros: `estado, cliente, fecha` |
| GET | `/pedidos/:id` | OWNER, ADMIN, AGENTE / Cliente vía token público de seguimiento | Detalle + historial de estados |
| PATCH | `/pedidos/:id/estado` | OWNER, ADMIN, AGENTE | Cambiar estado (queda registrado en `EstadoPedidoHistorial`) |
| POST | `/pedidos/:id/seguimiento` | OWNER, ADMIN | Agregar tracking de envío |
| GET | `/pedidos/numero/:numeroPedido/estado` | **Público** (para que la IA o el cliente consulten sin login) | Consulta de estado simplificada |

*("Interno" = no expuesto para llamada directa desde el frontend público sin pasar por el flujo de conversación o checkout; en la práctica sigue siendo un endpoint HTTP normal protegido por un guard de servicio interno.)*

---

## 8. Pagos (versión MVP — manual, sin webhook automático de pasarela)

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/pedidos/:id/pago` | Interno / OWNER, ADMIN | Genera registro de pago con link (Mercado Pago/Stripe Checkout simple, sin conciliación automática) |
| PATCH | `/pagos/:id/confirmar` | OWNER, ADMIN | Marca el pago como aprobado manualmente (mientras no haya webhook) |

*(La tabla `Transaccion` y el endpoint `/webhooks/pagos` para conciliación automática quedan definidos en el modelo pero se implementan en Fase 2, según lo acordado en el ajuste de alcance.)*

---

## 9. Reclamos

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| POST | `/reclamos` | Interno (AI Engine) / AGENTE+ | Crear reclamo |
| GET | `/reclamos` | OWNER, ADMIN, AGENTE | Lista con filtros: `estado, prioridad, asignadoA` |
| GET | `/reclamos/:id` | OWNER, ADMIN, AGENTE | Detalle + archivos adjuntos |
| PATCH | `/reclamos/:id` | OWNER, ADMIN, AGENTE | Cambiar estado/prioridad/asignación |
| POST | `/reclamos/:id/archivos` | Interno / AGENTE+ | Adjuntar imagen/video/audio |

---

## 10. AI Engine (uso interno, no expuesto públicamente salvo el webhook)

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/ai/process-message` | Interno (llamado por el worker, no por HTTP externo) | Orquesta: recupera contexto, arma prompt, llama OpenAI, ejecuta function calling, responde |
| GET | `/ai/logs` | OWNER, ADMIN | Lista de `LogIA` (para el dashboard de costos/uso) |

*(No hay endpoints públicos de "chat directo" en el MVP — todo entra por los webhooks de WhatsApp/Instagram o por el widget del storefront, que internamente usa el mismo motor.)*

---

## 11. Analytics / Dashboard

| Método | Ruta | Rol | Descripción |
|---|---|---|---|
| GET | `/dashboard/resumen` | OWNER, ADMIN | KPIs: ventas del período, pedidos, conversaciones, conversión |
| GET | `/dashboard/ventas` | OWNER, ADMIN | Serie temporal de ventas (para gráfico) |
| GET | `/dashboard/productos-mas-vendidos` | OWNER, ADMIN | Top N |
| GET | `/dashboard/ia` | OWNER, ADMIN | Tokens consumidos, costo, conversaciones atendidas por IA vs humano |

---

## 12. Storefront (tienda pública — consumida por `apps/storefront`)

| Método | Ruta | Acceso |
|---|---|---|
| GET | `/storefront/:empresaSlug/productos` | Público |
| GET | `/storefront/:empresaSlug/productos/:id` | Público |
| GET | `/storefront/:empresaSlug/categorias` | Público |
| POST | `/storefront/:empresaSlug/carrito` | Público (usa un `sessionId`/cliente anónimo hasta checkout) |
| POST | `/storefront/:empresaSlug/checkout` | Público | Crea Cliente (si no existe) + Pedido |
| GET | `/storefront/:empresaSlug/pedidos/:numeroPedido` | Público (requiere email o teléfono como validación simple) |

---

## 13. Resumen de reglas de autorización

```
Guard global: JwtAuthGuard (excepto rutas marcadas @Public())
Guard de rol: RolesGuard + decorador @Roles('OWNER','ADMIN',...)
Guard de tenant: TenantGuard — inyecta empresaId desde el JWT en cada request,
                 y un interceptor de Prisma agrega automáticamente
                 WHERE empresa_id = :empresaId a las queries de los repos
                 (así ningún desarrollador puede "olvidarse" el filtro).
```

---

## Próximo paso

**Paso 5: Diseño del AI Engine** — el corazón del producto: cómo se arma el prompt, cómo funciona el function calling, cómo se recupera contexto/memoria, y el flujo completo mensaje → respuesta.

¿Seguimos con eso?
