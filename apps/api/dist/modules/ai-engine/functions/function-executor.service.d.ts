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
export declare class FunctionExecutorService {
    private readonly productosService;
    private readonly carritosService;
    private readonly pedidosService;
    private readonly reclamosService;
    private readonly conversacionesService;
    private readonly logger;
    constructor(productosService: ProductosService, carritosService: CarritosService, pedidosService: PedidosService, reclamosService: ReclamosService, conversacionesService: ConversacionesService);
    ejecutar(nombreFuncion: string, argumentos: Record<string, any>, contexto: ContextoEjecucion): Promise<unknown>;
}
