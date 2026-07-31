import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateMarcaDto } from './dto/create-marca.dto';

@Injectable()
export class MarcasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(empresaId: string) {
    return this.prisma.marca.findMany({
      where: { empresaId },
      orderBy: { nombre: 'asc' },
    });
  }

  async crear(empresaId: string, dto: CreateMarcaDto) {
    const enUso = await this.prisma.marca.findFirst({
      where: { empresaId, nombre: dto.nombre },
    });

    if (enUso) {
      throw new ConflictException('Ya existe una marca con ese nombre');
    }

    return this.prisma.marca.create({ data: { ...dto, empresaId } });
  }
}
