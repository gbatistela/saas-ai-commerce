import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TipoPrompt } from '@prisma/client';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { ConfiguracionIaDto } from './dto/configuracion-ia.dto';
import { ActualizarPromptDto } from './dto/actualizar-prompt.dto';

// Espejo de los defaults declarados en el schema de Prisma: se usan cuando
// la empresa todavía no guardó su propia ConfiguracionIA. Dos variantes
// porque Prisma distingue entre "null" de JS (para lecturas/DTOs planos) y
// `Prisma.JsonNull` (el valor que hay que escribir en una columna Json).
const CONFIGURACION_IA_DEFAULT_LECTURA = {
  tono: null,
  reglasNegocioJson: null,
  modeloOpenai: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 600,
  horarioAtencionJson: null,
  condicionesHandoffJson: null,
};

const CONFIGURACION_IA_DEFAULT_CREATE = {
  modeloOpenai: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 600,
  reglasNegocioJson: Prisma.JsonNull,
  horarioAtencionJson: Prisma.JsonNull,
  condicionesHandoffJson: Prisma.JsonNull,
};

@Injectable()
export class EmpresaService {
  constructor(private readonly prisma: PrismaService) {}

  async obtener(empresaId: string) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id: empresaId },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa no encontrada');
    }

    return empresa;
  }

  async actualizar(empresaId: string, dto: UpdateEmpresaDto) {
    // findUnique previo asegura 404 claro en vez de un error genérico
    // de Prisma si el id no existe (no debería pasar dado que sale del JWT,
    // pero es una validación barata y explícita).
    await this.obtener(empresaId);

    return this.prisma.empresa.update({
      where: { id: empresaId },
      data: dto,
    });
  }

  async obtenerConfiguracionIA(empresaId: string) {
    const config = await this.prisma.configuracionIA.findUnique({
      where: { empresaId },
    });

    return config ?? { empresaId, ...CONFIGURACION_IA_DEFAULT_LECTURA };
  }

  async actualizarConfiguracionIA(empresaId: string, dto: ConfiguracionIaDto) {
    const { reglasNegocioJson, horarioAtencionJson, condicionesHandoffJson, ...resto } = dto;

    return this.prisma.configuracionIA.upsert({
      where: { empresaId },
      create: {
        empresaId,
        ...CONFIGURACION_IA_DEFAULT_CREATE,
        ...resto,
        ...(reglasNegocioJson !== undefined
          ? { reglasNegocioJson: reglasNegocioJson as Prisma.InputJsonValue }
          : {}),
        ...(horarioAtencionJson !== undefined
          ? { horarioAtencionJson: horarioAtencionJson as Prisma.InputJsonValue }
          : {}),
        ...(condicionesHandoffJson !== undefined
          ? { condicionesHandoffJson: condicionesHandoffJson as Prisma.InputJsonValue }
          : {}),
      },
      update: {
        ...resto,
        ...(reglasNegocioJson !== undefined
          ? { reglasNegocioJson: reglasNegocioJson as Prisma.InputJsonValue }
          : {}),
        ...(horarioAtencionJson !== undefined
          ? { horarioAtencionJson: horarioAtencionJson as Prisma.InputJsonValue }
          : {}),
        ...(condicionesHandoffJson !== undefined
          ? { condicionesHandoffJson: condicionesHandoffJson as Prisma.InputJsonValue }
          : {}),
      },
    });
  }

  async listarPrompts(empresaId: string) {
    return this.prisma.prompt.findMany({
      where: { empresaId, activo: true },
      orderBy: { tipo: 'asc' },
    });
  }

  async actualizarPrompt(
    empresaId: string,
    tipo: TipoPrompt,
    dto: ActualizarPromptDto,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const actual = await tx.prompt.findFirst({
        where: { empresaId, tipo, activo: true },
      });

      if (actual) {
        await tx.prompt.update({
          where: { id: actual.id },
          data: { activo: false },
        });
      }

      return tx.prompt.create({
        data: {
          empresaId,
          tipo,
          contenido: dto.contenido,
          version: (actual?.version ?? 0) + 1,
          activo: true,
        },
      });
    });
  }
}
