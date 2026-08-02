import { Prisma, TipoPrompt } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { ConfiguracionIaDto } from './dto/configuracion-ia.dto';
import { ActualizarPromptDto } from './dto/actualizar-prompt.dto';
export declare class EmpresaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtener(empresaId: string): Promise<{
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
        configJson: Prisma.JsonValue | null;
    }>;
    actualizar(empresaId: string, dto: UpdateEmpresaDto): Promise<{
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
        configJson: Prisma.JsonValue | null;
    }>;
    obtenerConfiguracionIA(empresaId: string): Promise<{
        empresaId: string;
        id: string;
        tono: string | null;
        reglasNegocioJson: Prisma.JsonValue | null;
        modeloOpenai: string;
        temperature: number;
        maxTokens: number;
        horarioAtencionJson: Prisma.JsonValue | null;
        condicionesHandoffJson: Prisma.JsonValue | null;
    } | {
        tono: null;
        reglasNegocioJson: null;
        modeloOpenai: string;
        temperature: number;
        maxTokens: number;
        horarioAtencionJson: null;
        condicionesHandoffJson: null;
        empresaId: string;
    }>;
    actualizarConfiguracionIA(empresaId: string, dto: ConfiguracionIaDto): Promise<{
        empresaId: string;
        id: string;
        tono: string | null;
        reglasNegocioJson: Prisma.JsonValue | null;
        modeloOpenai: string;
        temperature: number;
        maxTokens: number;
        horarioAtencionJson: Prisma.JsonValue | null;
        condicionesHandoffJson: Prisma.JsonValue | null;
    }>;
    listarPrompts(empresaId: string): Promise<{
        empresaId: string;
        id: string;
        createdAt: Date;
        contenido: string;
        tipo: import(".prisma/client").$Enums.TipoPrompt;
        version: number;
        activo: boolean;
    }[]>;
    actualizarPrompt(empresaId: string, tipo: TipoPrompt, dto: ActualizarPromptDto): Promise<{
        empresaId: string;
        id: string;
        createdAt: Date;
        contenido: string;
        tipo: import(".prisma/client").$Enums.TipoPrompt;
        version: number;
        activo: boolean;
    }>;
}
