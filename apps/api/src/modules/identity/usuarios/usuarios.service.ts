import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

const SALT_ROUNDS = 12;

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async listar(empresaId: string) {
    const usuarios = await this.prisma.usuario.findMany({
      where: { empresaId, deletedAt: null },
      include: { roles: { include: { rol: true } } },
      orderBy: { createdAt: 'asc' },
    });

    return usuarios.map((u) => this.mapearConRol(u));
  }

  async crear(empresaId: string, dto: CreateUsuarioDto) {
    const emailEnUso = await this.prisma.usuario.findFirst({
      where: { email: dto.email },
    });

    if (emailEnUso) {
      throw new ConflictException('Ya existe un usuario con ese email');
    }

    const rol = await this.prisma.rol.findFirst({
      where: { empresaId, nombre: dto.rol },
    });

    if (!rol) {
      throw new NotFoundException(
        `El rol ${dto.rol} no existe para esta empresa`,
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const usuario = await this.prisma.usuario.create({
      data: {
        empresaId,
        nombre: dto.nombre,
        email: dto.email,
        passwordHash,
        roles: {
          create: { rolId: rol.id },
        },
      },
      include: { roles: { include: { rol: true } } },
    });

    return this.mapearConRol(usuario);
  }

  async actualizar(
    empresaId: string,
    usuarioId: string,
    dto: UpdateUsuarioDto,
  ) {
    const usuario = await this.buscarDeLaEmpresaOFallar(empresaId, usuarioId);

    if (dto.rol) {
      const nuevoRol = await this.prisma.rol.findFirst({
        where: { empresaId, nombre: dto.rol },
      });

      if (!nuevoRol) {
        throw new NotFoundException(`El rol ${dto.rol} no existe`);
      }

      // MVP: un usuario tiene un solo rol activo. Se borra el vínculo
      // anterior y se crea el nuevo (evita acumular filas huérfanas).
      await this.prisma.usuarioRol.deleteMany({
        where: { usuarioId: usuario.id },
      });
      await this.prisma.usuarioRol.create({
        data: { usuarioId: usuario.id, rolId: nuevoRol.id },
      });
    }

    if (dto.estado) {
      await this.prisma.usuario.update({
        where: { id: usuario.id },
        data: { estado: dto.estado },
      });
    }

    const actualizado = await this.prisma.usuario.findUnique({
      where: { id: usuario.id },
      include: { roles: { include: { rol: true } } },
    });

    return this.mapearConRol(actualizado);
  }

  async desactivar(empresaId: string, usuarioId: string) {
    const usuario = await this.buscarDeLaEmpresaOFallar(empresaId, usuarioId);

    return this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { estado: 'INACTIVO', deletedAt: new Date() },
    });
  }

  private async buscarDeLaEmpresaOFallar(empresaId: string, usuarioId: string) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { id: usuarioId, empresaId, deletedAt: null },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado en esta empresa');
    }

    return usuario;
  }

  private mapearConRol(usuario: any) {
    return {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      estado: usuario.estado,
      ultimoLogin: usuario.ultimoLogin,
      rol: usuario.roles?.[0]?.rol?.nombre ?? null,
    };
  }
}
