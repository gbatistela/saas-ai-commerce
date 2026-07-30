"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const SALT_ROUNDS = 12;
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(dto) {
        const emailEnUso = await this.prisma.usuario.findFirst({
            where: { email: dto.email },
        });
        if (emailEnUso) {
            throw new common_1.ConflictException('Ya existe una cuenta con ese email');
        }
        const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
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
    async login(dto) {
        const usuario = await this.prisma.usuario.findFirst({
            where: { email: dto.email, deletedAt: null },
        });
        if (!usuario) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        const passwordValida = await bcrypt.compare(dto.password, usuario.passwordHash);
        if (!passwordValida) {
            throw new common_1.UnauthorizedException('Credenciales inválidas');
        }
        if (usuario.estado !== 'ACTIVO') {
            throw new common_1.UnauthorizedException('Usuario inactivo o suspendido');
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
    async refresh(refreshToken) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const usuario = await this.prisma.usuario.findUnique({
                where: { id: payload.sub },
            });
            if (!usuario || usuario.estado !== 'ACTIVO') {
                throw new common_1.UnauthorizedException('Sesión inválida');
            }
            const rol = await this.obtenerRolPrincipal(usuario.id);
            return this.generarTokens({
                userId: usuario.id,
                empresaId: usuario.empresaId,
                email: usuario.email,
                rol,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('Refresh token inválido o expirado');
        }
    }
    async generarTokens(payload) {
        const jwtPayload = {
            sub: payload.userId,
            empresaId: payload.empresaId,
            email: payload.email,
            rol: payload.rol,
        };
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get('jwt.secret'),
                expiresIn: this.configService.get('jwt.expiresIn'),
            }),
            this.jwtService.signAsync(jwtPayload, {
                secret: this.configService.get('jwt.refreshSecret'),
                expiresIn: this.configService.get('jwt.refreshExpiresIn'),
            }),
        ]);
        return { accessToken, refreshToken };
    }
    async obtenerRolPrincipal(usuarioId) {
        const usuarioRol = await this.prisma.usuarioRol.findFirst({
            where: { usuarioId },
            include: { rol: true },
        });
        return usuarioRol?.rol.nombre || 'AGENTE';
    }
    generarSlug(nombre) {
        return nombre
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }
    async asegurarSlugUnico(tx, slugBase) {
        let slug = slugBase;
        let intento = 0;
        while (await tx.empresa.findUnique({ where: { slug } })) {
            intento += 1;
            slug = `${slugBase}-${intento}`;
        }
        return slug;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map