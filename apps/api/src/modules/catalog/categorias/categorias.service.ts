import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

@Injectable()
export class CategoriasService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(empresaId: string) {
    return this.prisma.categoria.findMany({
      where: { empresaId, categoriaPadreId: null },
      include: {
        subcategorias: {
          include: { subcategorias: true },
        },
      },
      orderBy: { nombre: 'asc' },
    });
  }

  async crear(empresaId: string, dto: CreateCategoriaDto) {
    if (dto.categoriaPadreId) {
      await this.buscarOFallar(empresaId, dto.categoriaPadreId);
    }

    return this.prisma.categoria.create({
      data: { ...dto, empresaId },
    });
  }

  async actualizar(empresaId: string, id: string, dto: UpdateCategoriaDto) {
    await this.buscarOFallar(empresaId, id);

    if (dto.categoriaPadreId) {
      if (dto.categoriaPadreId === id) {
        throw new ConflictException(
          'Una categoría no puede ser su propia categoría padre',
        );
      }

      const nuevoPadre = await this.buscarOFallar(
        empresaId,
        dto.categoriaPadreId,
      );

      if (nuevoPadre.categoriaPadreId === id) {
        throw new ConflictException(
          'No se puede crear una referencia circular entre categorías',
        );
      }
    }

    return this.prisma.categoria.update({ where: { id }, data: dto });
  }

  private async buscarOFallar(empresaId: string, id: string) {
    const categoria = await this.prisma.categoria.findFirst({
      where: { id, empresaId },
    });

    if (!categoria) {
      throw new NotFoundException('Categoría no encontrada');
    }

    return categoria;
  }
}
