import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';

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
}
