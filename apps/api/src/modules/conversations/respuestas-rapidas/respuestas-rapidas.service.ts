import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateRespuestaRapidaDto } from './dto/create-respuesta-rapida.dto';

@Injectable()
export class RespuestasRapidasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(empresaId: string) {
    return this.prisma.respuestaRapida.findMany({
      where: { empresaId },
      orderBy: { atajo: 'asc' },
    });
  }

  async crear(empresaId: string, dto: CreateRespuestaRapidaDto) {
    const enUso = await this.prisma.respuestaRapida.findFirst({
      where: { empresaId, atajo: dto.atajo },
    });

    if (enUso) {
      throw new ConflictException('Ya existe un atajo con ese nombre');
    }

    return this.prisma.respuestaRapida.create({ data: { ...dto, empresaId } });
  }
}
