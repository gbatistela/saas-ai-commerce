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
exports.UsuariosService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const prisma_service_1 = require("../../../infra/prisma/prisma.service");
const SALT_ROUNDS = 12;
let UsuariosService = class UsuariosService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async listar(empresaId) {
        const usuarios = await this.prisma.usuario.findMany({
            where: { empresaId, deletedAt: null },
            include: { roles: { include: { rol: true } } },
            orderBy: { createdAt: 'asc' },
        });
        return usuarios.map((u) => this.mapearConRol(u));
    }
    async crear(empresaId, dto) {
        const emailEnUso = await this.prisma.usuario.findFirst({
            where: { email: dto.email },
        });
        if (emailEnUso) {
            throw new common_1.ConflictException('Ya existe un usuario con ese email');
        }
        const rol = await this.prisma.rol.findFirst({
            where: { empresaId, nombre: dto.rol },
        });
        if (!rol) {
            throw new common_1.NotFoundException(`El rol ${dto.rol} no existe para esta empresa`);
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
    async actualizar(empresaId, usuarioId, dto) {
        const usuario = await this.buscarDeLaEmpresaOFallar(empresaId, usuarioId);
        if (dto.rol) {
            const nuevoRol = await this.prisma.rol.findFirst({
                where: { empresaId, nombre: dto.rol },
            });
            if (!nuevoRol) {
                throw new common_1.NotFoundException(`El rol ${dto.rol} no existe`);
            }
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
    async desactivar(empresaId, usuarioId) {
        const usuario = await this.buscarDeLaEmpresaOFallar(empresaId, usuarioId);
        return this.prisma.usuario.update({
            where: { id: usuario.id },
            data: { estado: 'INACTIVO', deletedAt: new Date() },
        });
    }
    async buscarDeLaEmpresaOFallar(empresaId, usuarioId) {
        const usuario = await this.prisma.usuario.findFirst({
            where: { id: usuarioId, empresaId, deletedAt: null },
        });
        if (!usuario) {
            throw new common_1.NotFoundException('Usuario no encontrado en esta empresa');
        }
        return usuario;
    }
    mapearConRol(usuario) {
        return {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email,
            estado: usuario.estado,
            ultimoLogin: usuario.ultimoLogin,
            rol: usuario.roles?.[0]?.rol?.nombre ?? null,
        };
    }
};
exports.UsuariosService = UsuariosService;
exports.UsuariosService = UsuariosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsuariosService);
//# sourceMappingURL=usuarios.service.js.map