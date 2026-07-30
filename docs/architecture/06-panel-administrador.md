# Plataforma SaaS de IA — MVP
## PASO 6 — Panel Administrador (Wireframe / Estructura)

Este panel es lo que decide si la demo comercial convence o no. El objetivo no es solo que funcione: tiene que **verse como un producto SaaS de nivel profesional** (tipo Linear, Vercel, Intercom), no como un panel de administración genérico.

---

## 1. Navegación general

```
┌─────────────────────────────────────────────────────────────┐
│ [Logo empresa]  Buscar...              🔔  [Avatar] [Empresa▾]│
├───────────┬─────────────────────────────────────────────────┤
│           │                                                   │
│ Sidebar   │                Contenido principal                │
│           │                                                   │
│ 📊 Dashboard                                                   │
│ 💬 Conversaciones                                              │
│ 📦 Pedidos                                                     │
│ 🛍️ Productos                                                   │
│ 👥 Clientes                                                    │
│ 🎫 Reclamos                                                    │
│ 🤖 Configuración IA                                            │
│ ⚙️  Ajustes                                                    │
│           │                                                   │
└───────────┴─────────────────────────────────────────────────┘
```

- Sidebar colapsable, con indicador de notificaciones (ej. conversaciones en HANDOFF esperando respuesta) al lado de "Conversaciones".
- Modo oscuro por defecto (más "producto SaaS moderno" que claro; toggle disponible).
- Selector de empresa arriba a la derecha solo visible si en el futuro un mismo usuario administra varias empresas (no aplica en MVP pero se deja el lugar).

---

## 2. Dashboard (pantalla de entrada — la que más impacto tiene en una demo)

```
┌─────────────────────────────────────────────────────────────┐
│  "Hola [Nombre] 👋 — Así viene funcionando tu asistente"       │
├───────────────┬───────────────┬───────────────┬─────────────┤
│ Ventas del mes│ Pedidos       │ Conversaciones│ Conversión   │
│ $ 1.240.000   │ 87            │ 312           │ 34%          │
│ ▲ 12% vs mes  │ ▲ 8 pendientes│ 289 por IA     │ ▲ 3pp        │
├───────────────┴───────────────┴───────────────┴─────────────┤
│  📈 Gráfico de ventas (últimos 30 días)                        │
├─────────────────────────────┬─────────────────────────────────┤
│ 🏆 Productos más vendidos     │ 🤖 Actividad de la IA             │
│ 1. Zapatilla X - 24 ventas    │ Tokens usados: 1.2M              │
│ 2. Perfume Y - 19 ventas      │ Costo estimado: $8.40 USD        │
│ 3. ...                        │ Tiempo resp. promedio: 4.2s      │
├───────────────────────────────┴─────────────────────────────────┤
│  💬 Últimas conversaciones (feed en vivo, 5 más recientes)       │
└─────────────────────────────────────────────────────────────────┘
```

**Por qué este orden:** arriba los números que un dueño de negocio mira primero (plata, pedidos), en el medio la prueba de que "la IA está trabajando" (esto es lo que vende la suscripción), abajo actividad reciente para que la demo se sienta viva.

---

## 3. Conversaciones (bandeja tipo WhatsApp Web / Intercom)

```
┌───────────────┬───────────────────────────────┬───────────────┐
│ Lista          │  Chat activo                    │ Panel cliente │
│                │                                  │               │
│ 🟢 Juan Pérez   │  Juan Pérez          🤖 IA activa │ 👤 Juan Pérez  │
│ "¿Tienen talle │  ─────────────────────────────  │ Tel: +54 9... │
│ M?" · hace 2m  │  Cliente: ¿Tienen talle M?        │ 3 pedidos     │
│                │  IA: Sí! Tenemos en negro y azul  │ Talle: M      │
│ 🟡 María Gómez  │       ¿te muestro fotos?          │ Color fav:    │
│ (handoff)      │                                  │ Negro         │
│                │  [Escribir mensaje...] [Enviar]   │               │
│ ⚪ Carlos Ruiz  │                                  │ [Ver pedidos] │
│ (cerrada)      │  ⚡ Atajos rápidos                 │ [Ver historial]│
└───────────────┴───────────────────────────────┴───────────────┘
```

- Indicador visual claro de estado: 🟢 IA respondiendo activamente, 🟡 esperando humano (handoff), ⚪ cerrada.
- Al escribir un mensaje manual, la conversación pasa automáticamente a modo humano (la IA se pausa) — esto es clave para que un agente pueda "tomar el control" sin fricción.
- Panel derecho con contexto del cliente (memoria) visible en todo momento — es lo que hace evidente el valor de "recuerda todo del cliente".

---

## 4. Productos (gestión de catálogo)

```
┌─────────────────────────────────────────────────────────────┐
│ Productos          [+ Nuevo producto]     🔍 Buscar...        │
├─────┬──────────────────┬──────────┬────────┬────────┬───────┤
│ Img │ Nombre            │ Categoría│ Precio │ Stock  │ Estado│
├─────┼──────────────────┼──────────┼────────┼────────┼───────┤
│ 🖼️  │ Zapatilla Runner  │ Calzado  │ $45.000│ 12     │ ●Activo│
│ 🖼️  │ Perfume Aqua      │ Perfum.  │ $28.000│ 3 ⚠️    │ ●Activo│
└─────┴──────────────────┴──────────┴────────┴────────┴───────┘
```

**Modal/página de alta-edición de producto:**
- Tabs: Info general | Imágenes/Video | Variantes (color/talle + stock por variante) | Relacionados (cross-sell) | SEO
- Drag & drop para subir múltiples imágenes de una vez (sube directo a MinIO vía presigned URL)
- Alertas de stock bajo visibles inline (icono ⚠️ como en el mock de arriba)

---

## 5. Pedidos

```
┌─────────────────────────────────────────────────────────────┐
│ Pedidos      [Todos▾] [Pendiente][Preparando][Despachado]...  │
├──────────┬──────────────┬───────────┬──────────┬─────────────┤
│ N° Pedido│ Cliente       │ Total     │ Estado    │ Fecha       │
├──────────┼──────────────┼───────────┼──────────┼─────────────┤
│ #0234    │ Juan Pérez    │ $45.000   │ Preparando│ hace 1h     │
└──────────┴──────────────┴───────────┴──────────┴─────────────┘
```

**Detalle de pedido:** items, cliente, dirección, línea de tiempo visual del historial de estados (`EstadoPedidoHistorial`), botón para avanzar de estado (con validación de transición: no se puede pasar de "Pendiente" a "Entregado" salteando pasos), botón "agregar tracking".

---

## 6. Clientes

Vista tipo CRM ligero: lista con búsqueda + filtro "frecuentes/nuevos", y ficha de cliente con: datos, memoria (preferencias detectadas por IA), historial de pedidos, historial de conversaciones, reclamos asociados. Esta ficha es la que mejor demuestra "memoria real" en una demo.

---

## 7. Reclamos

Kanban simple por estado (Abierto / En proceso / Resuelto / Escalado) — más visual e intuitivo para una demo que una tabla plana. Cada tarjeta: cliente, resumen, prioridad (color), adjuntos.

---

## 8. Configuración IA (la pantalla más importante para vender el "se adapta a cualquier rubro")

```
┌─────────────────────────────────────────────────────────────┐
│  Configuración del Asistente                                  │
├─────────────────────────────────────────────────────────────┤
│  Rubro del negocio         [Perfumería          ▾]             │
│  Tono de comunicación       [Cercano y cálido    ▾]             │
│  Nombre del negocio (para   [Perfumería Bella Aroma]            │
│  que la IA se presente)                                        │
│                                                                 │
│  Horario de atención IA     Lun-Vie 9-20hs  [Editar]            │
│                                                                 │
│  Reglas específicas del negocio (texto libre, se inyecta       │
│  al prompt):                                                   │
│  ┌───────────────────────────────────────────────────────┐    │
│  │ "Ofrecé siempre muestras gratis en compras mayores a   │    │
│  │  $30.000. No hacemos envíos los domingos."              │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  Cuándo derivar a un humano:                                   │
│  ☑ Cliente pide hablar con una persona                          │
│  ☑ Reclamo con tono muy negativo                                │
│  ☑ Compra mayor a $ [___________]                               │
│                                                                 │
│  [ 💬 Probar el asistente ]     [ Guardar cambios ]              │
└─────────────────────────────────────────────────────────────┘
```

**"Probar el asistente"** abre un chat de prueba embebido en el panel mismo (usa el mismo AI Engine, conversación de tipo "test", no genera Cliente/Pedido reales) — esto es oro para la demo comercial: el prospecto cambia el tono o las reglas y prueba en el momento cómo responde diferente.

---

## 9. Ajustes

- Datos de la empresa (logo, moneda, timezone)
- Usuarios y roles (alta de agentes)
- Conexión de canales: WhatsApp (QR de Evolution API para vincular el número), Instagram (OAuth con Meta)
- Plan de suscripción (aunque el cobro real sea Fase 2, mostrar "Plan actual: Pro — hasta 500 conversaciones/mes" ya construye la narrativa comercial)

---

## 10. Principios de diseño visual (para cuando pasemos a código)

- **Design tokens consistentes:** una paleta de 1 color primario + neutros, tipografía clara (Inter o similar), no default de ningún framework "sin tocar".
- **Estados vacíos cuidados:** cuando no hay conversaciones/productos todavía, mostrar una ilustración/mensaje que invite a la acción, no una tabla vacía pelada — importa mucho en una demo con datos de prueba.
- **Feedback inmediato:** toasts de confirmación, skeletons de carga, nunca pantallas en blanco mientras carga.
- **Responsive:** funcional en tablet al menos (muchos dueños de comercio van a mirar esto desde un iPad), aunque el uso principal sea desktop.

Cuando lleguemos a escribir el código de estas pantallas, vamos a usar Shadcn UI + Tailwind siguiendo estos lineamientos, con atención especial a que no se vea "genérico" (evitar el look por defecto de componentes sin personalizar).

---

## Próximo paso

Con esto ya tenemos el diseño completo: arquitectura, entidades, DB, endpoints, AI Engine y panel. El siguiente paso lógico es **empezar a escribir código real**, módulo por módulo. El orden recomendado:

1. **Identity + Auth** (todo depende de esto — JWT, guards, tenant isolation)
2. **Catalog** (CRUD de productos, es la base de datos que vamos a necesitar para probar el resto)
3. **Conversations + AI Engine** (el corazón del producto)
4. **Sales/Orders**
5. **Admin Panel (Next.js)** conectado a lo anterior
6. **Storefront**

¿Arrancamos con el código de **Identity + Auth**?
