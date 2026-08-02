import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class MarcasController {
    private readonly marcasService;
    constructor(marcasService: MarcasService);
    listar(user: AuthenticatedUser): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        logoUrl: string | null;
    }[]>;
    crear(user: AuthenticatedUser, dto: CreateMarcaDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        logoUrl: string | null;
    }>;
}
