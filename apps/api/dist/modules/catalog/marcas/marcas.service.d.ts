import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
export declare class MarcasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(empresaId: string): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        logoUrl: string | null;
    }[]>;
    crear(empresaId: string, dto: CreateMarcaDto): Promise<{
        empresaId: string;
        id: string;
        nombre: string;
        logoUrl: string | null;
    }>;
}
