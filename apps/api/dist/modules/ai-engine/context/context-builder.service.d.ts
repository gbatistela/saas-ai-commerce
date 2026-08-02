import { PrismaService } from '../../../infra/prisma/prisma.service';
export declare class ContextBuilderService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    build(empresaId: string, conversacionId: string, clienteId: string): Promise<{
        empresa: {
            rubro: string | null;
            id: string;
            nombre: string;
            estado: import(".prisma/client").$Enums.EstadoGeneral;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            slug: string;
            logoUrl: string | null;
            telefonoWhatsapp: string | null;
            instagramAccountId: string | null;
            moneda: string;
            timezone: string;
            plan: string;
            configJson: import("@prisma/client/runtime/library").JsonValue | null;
        };
        configIA: {
            tono: string | null;
            reglasNegocioJson: unknown;
            modeloOpenai: string;
            temperature: number;
            maxTokens: number;
            horarioAtencionJson: unknown;
            condicionesHandoffJson: unknown;
        };
        promptSistemaPersonalizado: string | undefined;
        cliente: {
            empresaId: string;
            email: string | null;
            id: string;
            nombre: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            telefono: string | null;
            esFrecuente: boolean;
            presupuestoEstimado: import("@prisma/client/runtime/library").Decimal | null;
            talleP: string | null;
            colorPreferido: string | null;
            marcaPreferida: string | null;
            metodoPagoPreferido: string | null;
            notasIA: string | null;
            canalOrigen: import(".prisma/client").$Enums.CanalOrigen;
        };
        historialReciente: {
            id: string;
            createdAt: Date;
            contenido: string | null;
            tipo: import(".prisma/client").$Enums.TipoMensaje;
            archivoId: string | null;
            conversacionId: string;
            emisor: import(".prisma/client").$Enums.EmisorMensaje;
            tokensUsados: number | null;
            costoUsd: import("@prisma/client/runtime/library").Decimal | null;
            intencionDetectada: string | null;
            sentimiento: string | null;
        }[];
    }>;
}
export type ContextoConversacion = Awaited<ReturnType<ContextBuilderService['build']>>;
