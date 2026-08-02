import { Injectable, Logger, HttpException } from '@nestjs/common';
import { ProductosService } from '../../catalog/productos/productos.service';
import { CarritosService } from '../../sales/carritos/carritos.service';
import { PedidosService } from '../../sales/pedidos/pedidos.service';
import { ReclamosService } from '../../support/reclamos/reclamos.service';
import { ConversacionesService } from '../../conversations/conversaciones/conversaciones.service';

export interface ContextoEjecucion {
  empresaId: string;
  clienteId: string;
  conversacionId: string;
}

@Injectable()
export class FunctionExecutorService {
  private readonly logger = new Logger(FunctionExecutorService.name);

  constructor(
    private readonly productosService: ProductosService,
    private readonly carritosService: CarritosService,
    private readonly pedidosService: PedidosService,
    private readonly reclamosService: ReclamosService,
    private readonly conversacionesService: ConversacionesService,
  ) {}

  /**
   * Ejecuta una función pedida por el modelo y siempre devuelve un objeto
   * serializable (nunca deja escapar una excepción): un error de negocio
   * (stock insuficiente, ID inexistente, etc.) se traduce en `{ error }`
   * para que el modelo lo lea y se lo explique al cliente, en vez de
   * tirar abajo el worker que procesa el mensaje.
   */
  async ejecutar(
    nombreFuncion: string,
    argumentos: Record<string, any>,
    contexto: ContextoEjecucion,
  ): Promise<unknown> {
    try {
      switch (nombreFuncion) {
        case 'buscar_productos':
          return await this.productosService.buscarParaIA(contexto.empresaId, {
            query: argumentos.query,
            categoriaNombre: argumentos.categoria,
            precioMax: argumentos.precioMax,
          });

        case 'consultar_stock':
          return await this.productosService.stockDeVariante(
            contexto.empresaId,
            argumentos.varianteId,
          );

        case 'agregar_al_carrito': {
          const carrito = await this.carritosService.obtenerActivoOCrear(
            contexto.empresaId,
            contexto.clienteId,
          );
          return await this.carritosService.agregarItem(contexto.empresaId, carrito.id, {
            varianteId: argumentos.varianteId,
            cantidad: argumentos.cantidad,
          });
        }

        case 'crear_pedido': {
          const carrito = await this.carritosService.obtenerActivoOCrear(
            contexto.empresaId,
            contexto.clienteId,
          );
          return await this.pedidosService.crearDesdeCarrito(contexto.empresaId, {
            carritoId: carrito.id,
            direccionId: argumentos.direccionId,
          });
        }

        case 'consultar_estado_pedido':
          return await this.pedidosService.estadoPorNumero(
            contexto.empresaId,
            argumentos.numeroPedido,
          );

        case 'crear_reclamo':
          return await this.reclamosService.crear(contexto.empresaId, {
            clienteId: contexto.clienteId,
            pedidoId: argumentos.pedidoId,
            tipo: 'reportado_por_ia',
            descripcion: argumentos.descripcion,
          });

        case 'derivar_a_humano':
          await this.conversacionesService.actualizarEstado(
            contexto.empresaId,
            contexto.conversacionId,
            { estado: 'HANDOFF' },
          );
          return { derivado: true, motivo: argumentos.motivo };

        default:
          return { error: `Función desconocida: ${nombreFuncion}` };
      }
    } catch (error) {
      const mensaje =
        error instanceof HttpException
          ? (error.getResponse() as any)?.message ?? error.message
          : 'Error interno al ejecutar la función';

      this.logger.warn(`Función "${nombreFuncion}" falló: ${mensaje}`);
      return { error: mensaje };
    }
  }
}
