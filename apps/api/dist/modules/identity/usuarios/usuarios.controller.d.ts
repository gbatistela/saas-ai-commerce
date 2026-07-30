import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class UsuariosController {
    private readonly usuariosService;
    constructor(usuariosService: UsuariosService);
    listar(user: AuthenticatedUser): Promise<any>;
    crear(user: AuthenticatedUser, dto: CreateUsuarioDto): Promise<{
        id: any;
        nombre: any;
        email: any;
        estado: any;
        ultimoLogin: any;
        rol: any;
    }>;
    actualizar(user: AuthenticatedUser, id: string, dto: UpdateUsuarioDto): Promise<{
        id: any;
        nombre: any;
        email: any;
        estado: any;
        ultimoLogin: any;
        rol: any;
    }>;
    desactivar(user: AuthenticatedUser, id: string): Promise<any>;
}
