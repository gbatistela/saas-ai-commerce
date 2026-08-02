import { TipoPrompt } from '@prisma/client';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { ConfiguracionIaDto } from './dto/configuracion-ia.dto';
import { ActualizarPromptDto } from './dto/actualizar-prompt.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    obtener(user: AuthenticatedUser): Promise<{
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
    }>;
    actualizar(user: AuthenticatedUser, dto: UpdateEmpresaDto): Promise<{
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
    }>;
    obtenerConfiguracionIA(user: AuthenticatedUser): Promise<{
        empresaId: string;
        id: string;
        tono: string | null;
        reglasNegocioJson: import("@prisma/client/runtime/library").JsonValue | null;
        modeloOpenai: string;
        temperature: number;
        maxTokens: number;
        horarioAtencionJson: import("@prisma/client/runtime/library").JsonValue | null;
        condicionesHandoffJson: import("@prisma/client/runtime/library").JsonValue | null;
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
    actualizarConfiguracionIA(user: AuthenticatedUser, dto: ConfiguracionIaDto): Promise<{
        empresaId: string;
        id: string;
        tono: string | null;
        reglasNegocioJson: import("@prisma/client/runtime/library").JsonValue | null;
        modeloOpenai: string;
        temperature: number;
        maxTokens: number;
        horarioAtencionJson: import("@prisma/client/runtime/library").JsonValue | null;
        condicionesHandoffJson: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
    listarPrompts(user: AuthenticatedUser): Promise<{
        empresaId: string;
        id: string;
        createdAt: Date;
        contenido: string;
        tipo: import(".prisma/client").$Enums.TipoPrompt;
        version: number;
        activo: boolean;
    }[]>;
    actualizarPrompt(user: AuthenticatedUser, tipo: TipoPrompt, dto: ActualizarPromptDto): Promise<{
        empresaId: string;
        id: string;
        createdAt: Date;
        contenido: string;
        tipo: import(".prisma/client").$Enums.TipoPrompt;
        version: number;
        activo: boolean;
    }>;
}
