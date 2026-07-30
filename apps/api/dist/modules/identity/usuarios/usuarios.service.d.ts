import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
export declare class UsuariosService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(empresaId: string): Promise<any>;
    crear(empresaId: string, dto: CreateUsuarioDto): Promise<{
        id: any;
        nombre: any;
        email: any;
        estado: any;
        ultimoLogin: any;
        rol: any;
    }>;
    actualizar(empresaId: string, usuarioId: string, dto: UpdateUsuarioDto): Promise<{
        id: any;
        nombre: any;
        email: any;
        estado: any;
        ultimoLogin: any;
        rol: any;
    }>;
    desactivar(empresaId: string, usuarioId: string): Promise<any>;
    private buscarDeLaEmpresaOFallar;
    private mapearConRol;
}
