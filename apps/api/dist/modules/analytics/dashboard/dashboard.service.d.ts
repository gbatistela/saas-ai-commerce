import { PrismaService } from '../../../infra/prisma/prisma.service';
import { QueryRangoDto } from './dto/query-rango.dto';
import { QueryTopProductosDto } from './dto/query-top-productos.dto';
export declare class DashboardService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resumen(empresaId: string, query: QueryRangoDto): Promise<{
        rango: {
            desde: Date;
            hasta: Date;
        };
        ventasTotal: number;
        pedidosCount: number;
        conversacionesCount: number;
        tasaConversion: number;
    }>;
    ventasPorDia(empresaId: string, query: QueryRangoDto): Promise<{
        fecha: Date;
        cantidadPedidos: number;
        total: number;
    }[]>;
    productosMasVendidos(empresaId: string, query: QueryTopProductosDto): Promise<{
        productoId: string;
        nombre: string;
        cantidadVendida: number;
        totalVendido: number;
    }[]>;
    metricasIA(empresaId: string, query: QueryRangoDto): Promise<{
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
    private resolverRango;
}
