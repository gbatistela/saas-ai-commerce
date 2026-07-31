import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const SALT_ROUNDS = 12;

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const emailEnUso = await this.prisma.usuario.findFirst({
      where: { email: dto.email },
    });

    if (emailEnUso) {
      throw new ConflictException('Ya existe una cuenta con ese email');
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    // Empresa + Usuario OWNER se crean en una sola transacción:
    // si algo falla, no queda una empresa huérfana sin usuario.
    const resultado = await this.prisma.$transaction(async (tx) => {
      const slugBase = this.generarSlug(dto.nombreEmpresa);
      const slug = await this.asegurarSlugUnico(tx, slugBase);

      const empresa = await tx.empresa.create({
        data: {
          nombre: dto.nombreEmpresa,
          slug,
          rubro: dto.rubro,
        },
      });

      const usuario = await tx.usuario.create({
        data: {
          empresaId: empresa.id,
          nombre: dto.nombreUsuario,
          email: dto.email,
          passwordHash,
        },
      });

      // Roles base de la empresa (MVP: fijos, se crean una vez al alta).
      const [rolOwner] = await Promise.all([
        tx.rol.create({
          data: {
            empresaId: empresa.id,
            nombre: 'OWNER',
            descripcion: 'Dueño de la cuenta, acceso total',
            esSistema: true,
          },
        }),
        tx.rol.create({
          data: {
            empresaId: empresa.id,
            nombre: 'ADMIN',
            descripcion: 'Administra todo salvo facturación',
            esSistema: true,
          },
        }),
        tx.rol.create({
          data: {
            empresaId: empresa.id,
            nombre: 'AGENTE',
            descripcion: 'Atiende conversaciones, pedidos y reclamos',
            esSistema: true,
          },
        }),
      ]);

      await tx.usuarioRol.create({
        data: { usuarioId: usuario.id, rolId: rolOwner.id },
      });

      return { empresa, usuario };
    });

    const tokens = await this.generarTokens({
      userId: resultado.usuario.id,
      empresaId: resultado.empresa.id,
      email: resultado.usuario.email,
      rol: 'OWNER',
    });

    return {
      empresa: {
        id: resultado.empresa.id,
        nombre: resultado.empresa.nombre,
        slug: resultado.empresa.slug,
      },
      usuario: {
        id: resultado.usuario.id,
        nombre: resultado.usuario.nombre,
        email: resultado.usuario.email,
        rol: 'OWNER',
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findFirst({
      where: { email: dto.email, deletedAt: null },
    });

    // Mensaje genérico a propósito: no revelar si el email existe o no
    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValida = await bcrypt.compare(
      dto.password,
      usuario.passwordHash,
    );

    if (!passwordValida) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (usuario.estado !== 'ACTIVO') {
      throw new UnauthorizedException('Usuario inactivo o suspendido');
    }

    const rol = await this.obtenerRolPrincipal(usuario.id);

    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() },
    });

    const tokens = await this.generarTokens({
      userId: usuario.id,
      empresaId: usuario.empresaId,
      email: usuario.email,
      rol,
    });

    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol,
      },
      ...tokens,
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const usuario = await this.prisma.usuario.findUnique({
        where: { id: payload.sub },
      });

      if (!usuario || usuario.estado !== 'ACTIVO') {
        throw new UnauthorizedException('Sesión inválida');
      }

      const rol = await this.obtenerRolPrincipal(usuario.id);

      return this.generarTokens({
        userId: usuario.id,
        empresaId: usuario.empresaId,
        email: usuario.email,
        rol,
      });
    } catch {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  private async generarTokens(payload: {
    userId: string;
    empresaId: string;
    email: string;
    rol: 'OWNER' | 'ADMIN' | 'AGENTE';
  }): Promise<TokenPair> {
    const jwtPayload = {
      sub: payload.userId,
      empresaId: payload.empresaId,
      email: payload.email,
      rol: payload.rol,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  /**
   * MVP: el rol se resuelve leyendo la primera fila de UsuarioRol->Rol.
   * En Fase 2 (permisos granulares) esto se reemplaza por lógica
   * completa de RBAC con múltiples roles y permisos por rol.
   */
  private async obtenerRolPrincipal(
    usuarioId: string,
  ): Promise<'OWNER' | 'ADMIN' | 'AGENTE'> {
    const usuarioRol = await this.prisma.usuarioRol.findFirst({
      where: { usuarioId },
      include: { rol: true },
    });

    return (usuarioRol?.rol.nombre as 'OWNER' | 'ADMIN' | 'AGENTE') || 'AGENTE';
  }

  private generarSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // saca acentos
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  private async asegurarSlugUnico(tx: any, slugBase: string): Promise<string> {
    let slug = slugBase;
    let intento = 0;

    while (await tx.empresa.findUnique({ where: { slug } })) {
      intento += 1;
      slug = `${slugBase}-${intento}`;
    }

    return slug;
  }
}
