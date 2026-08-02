import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class CategoriasController {
    private readonly categoriasService;
    constructor(categoriasService: CategoriasService);
    listar(user: AuthenticatedUser): Promise<({
        subcategorias: ({
            subcategorias: {
                empresaId: string;
                id: string;
                nombre: string;
                categoriaPadreId: string | null;
            }[];
        } & {
            empresaId: string;
            id: string;
            nombre: string;
            categoriaPadreId: string | null;
        })[];
    } & {
        empresaId: string;
        id: string;
        nombre: string;
        categoriaPadreId: string | null;
    })[]>;
    crear(user: AuthenticatedUser, dto: CreateCategoriaDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        categoriaPadreId: string | null;
    }>;
    actualizar(user: AuthenticatedUser, id: string, dto: UpdateCategoriaDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        categoriaPadreId: string | null;
    }>;
}
