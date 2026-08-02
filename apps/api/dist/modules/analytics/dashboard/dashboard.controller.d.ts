import { DashboardService } from './dashboard.service';
import { QueryRangoDto } from './dto/query-rango.dto';
import { QueryTopProductosDto } from './dto/query-top-productos.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    resumen(user: AuthenticatedUser, query: QueryRangoDto): Promise<{
        rango: {
            desde: Date;
            hasta: Date;
        };
        ventasTotal: number;
        pedidosCount: number;
        conversacionesCount: number;
        tasaConversion: number;
    }>;
    ventas(user: AuthenticatedUser, query: QueryRangoDto): Promise<{
        fecha: Date;
        cantidadPedidos: number;
        total: number;
    }[]>;
    productosMasVendidos(user: AuthenticatedUser, query: QueryTopProductosDto): Promise<{
        productoId: string;
        nombre: string;
        cantidadVendida: number;
        totalVendido: number;
    }[]>;
    metricasIA(user: AuthenticatedUser, query: QueryRangoDto): Promise<{
        rango: {
            desde: Date;
            hasta: Date;
        };
        mensajesProcesados: number;
        tokensPrompt: number;
        tokensCompletion: number;
        costoUsdEstimado: number;
        latenciaPromedioMs: number;
        mensajesPorEmisor: {
            [k: string]: number;
        };
        conversacionesAtendidasPorIA: number;
        conversacionesConHandoffHumano: number;
    }>;
}
