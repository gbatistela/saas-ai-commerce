import { AiFunctionDefinition } from '../../providers/ai-provider.interface';

/**
 * Contrato de function calling del MVP (docs/architecture/05-ai-engine.md §4).
 *
 * Deliberadamente NO se le pide al modelo `clienteId`/`empresaId`/`carritoId`:
 * esos identificadores ya se conocen por el contexto de la conversación y
 * los inyecta el FunctionExecutor. Confiarle esos IDs al modelo abriría la
 * puerta a que "alucine" o mezcle datos de otro cliente — los números y las
 * identidades siempre salen del backend, nunca del LLM.
 */
export const FUNCIONES_DISPONIBLES: AiFunctionDefinition[] = [
  {
    name: 'buscar_productos',
    description:
      'Busca productos en el catálogo de la empresa por texto, categoría y/o precio máximo. Devuelve como máximo 5 resultados con nombre, precio y stock por variante. Usar antes de afirmar que algo existe o tiene determinado precio.',
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Texto de búsqueda: nombre o palabras clave del producto',
        },
        categoria: {
          type: 'string',
          description: 'Nombre de categoría para filtrar (opcional)',
        },
        precioMax: {
          type: 'number',
          description: 'Precio máximo a considerar (opcional)',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'consultar_stock',
    description: 'Consulta la cantidad disponible de una variante puntual de un producto.',
    parameters: {
      type: 'object',
      properties: {
        varianteId: { type: 'string', description: 'ID de la variante a consultar' },
      },
      required: ['varianteId'],
    },
  },
  {
    name: 'agregar_al_carrito',
    description:
      'Agrega una cantidad de una variante de producto al carrito activo del cliente actual de la conversación.',
    parameters: {
      type: 'object',
      properties: {
        varianteId: { type: 'string' },
        cantidad: { type: 'number', description: 'Cantidad a agregar, mínimo 1' },
      },
      required: ['varianteId', 'cantidad'],
    },
  },
  {
    name: 'crear_pedido',
    description:
      'Crea un pedido a partir del carrito activo del cliente actual. Usar SOLO después de que el cliente confirmó explícitamente que quiere comprar lo que tiene en el carrito.',
    parameters: {
      type: 'object',
      properties: {
        direccionId: {
          type: 'string',
          description: 'ID de una dirección ya cargada del cliente, si corresponde (opcional)',
        },
      },
      required: [],
    },
  },
  {
    name: 'consultar_estado_pedido',
    description: 'Consulta el estado actual y el historial de un pedido a partir de su número.',
    parameters: {
      type: 'object',
      properties: {
        numeroPedido: { type: 'string' },
      },
      required: ['numeroPedido'],
    },
  },
  {
    name: 'crear_reclamo',
    description:
      'Registra un reclamo o queja del cliente actual, opcionalmente asociado a un pedido puntual.',
    parameters: {
      type: 'object',
      properties: {
        pedidoId: {
          type: 'string',
          description: 'ID del pedido relacionado, si el reclamo es sobre un pedido (opcional)',
        },
        descripcion: {
          type: 'string',
          description: 'Descripción del reclamo, en las palabras del cliente',
        },
      },
      required: ['descripcion'],
    },
  },
  {
    name: 'derivar_a_humano',
    description:
      'Deriva la conversación a un agente humano y detiene las respuestas automáticas de la IA. Usar cuando el cliente lo pide explícitamente, hay una queja grave, se detecta intención de cancelar una compra grande, o no se puede resolver la consulta con las herramientas disponibles.',
    parameters: {
      type: 'object',
      properties: {
        motivo: { type: 'string', description: 'Motivo breve de la derivación' },
      },
      required: ['motivo'],
    },
  },
];
