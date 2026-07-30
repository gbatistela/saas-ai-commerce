import { PrismaService } from '../../../infra/prisma/prisma.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
export declare class EmpresaService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    obtener(empresaId: string): Promise<any>;
    actualizar(empresaId: string, dto: UpdateEmpresaDto): Promise<any>;
}
