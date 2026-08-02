import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
export declare class CategoriasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(empresaId: string): Promise<({
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
    crear(empresaId: string, dto: CreateCategoriaDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        categoriaPadreId: string | null;
    }>;
    actualizar(empresaId: string, id: string, dto: UpdateCategoriaDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        categoriaPadreId: string | null;
    }>;
    private buscarOFallar;
}
