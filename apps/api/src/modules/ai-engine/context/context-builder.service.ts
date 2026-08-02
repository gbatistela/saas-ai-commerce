import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';

const N_MENSAJES_CONTEXTO = 20;

// Mismos defaults que ConfiguracionIA en el schema, para cuando la
// empresa todavía no guardó su propia configuración.
const CONFIG_IA_DEFAULT = {
  tono: null as string | null,
  reglasNegocioJson: null as unknown,
  modeloOpenai: 'gpt-4o-mini',
  temperature: 0.7,
  maxTokens: 600,
  horarioAtencionJson: null as unknown,
  condicionesHandoffJson: null as unknown,
};

@Injectable()
export class ContextBuilderService {
  constructor(private readonly prisma: PrismaService) {}

  async build(empresaId: string, conversacionId: string, clienteId: string) {
    const [empresa, configIA, promptSistema, cliente, mensajes] = await Promise.all([
      this.prisma.empresa.findUnique({ where: { id: empresaId } }),
      this.prisma.configuracionIA.findUnique({ where: { empresaId } }),
      this.prisma.prompt.findFirst({
        where: { empresaId, tipo: 'SYSTEM', activo: true },
        orderBy: { version: 'desc' },
      }),
      this.prisma.cliente.findUnique({ where: { id: clienteId } }),
      this.prisma.mensaje.findMany({
        where: { conversacionId },
        orderBy: { createdAt: 'desc' },
        take: N_MENSAJES_CONTEXTO,
      }),
    ]);

    if (!empresa) throw new NotFoundException('Empresa no encontrada');
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    return {
      empresa,
      configIA: configIA ?? CONFIG_IA_DEFAULT,
      promptSistemaPersonalizado: promptSistema?.contenido,
      cliente,
      // ascendente (más viejo primero) para armar el prompt en orden cronológico
      historialReciente: mensajes.reverse(),
    };
  }
}

export type ContextoConversacion = Awaited<
  ReturnType<ContextBuilderService['build']>
>;
