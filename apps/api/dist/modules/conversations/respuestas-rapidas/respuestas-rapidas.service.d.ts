import { PrismaService } from '../../../infra/prisma/prisma.service';
import { CreateRespuestaRapidaDto } from './dto/create-respuesta-rapida.dto';
export declare class RespuestasRapidasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listar(empresaId: string): Promise<{
        empresaId: string;
        id: string;
        contenido: string;
        atajo: string;
    }[]>;
    crear(empresaId: string, dto: CreateRespuestaRapidaDto): Promise<{
        empresaId: string;
        id: string;
        contenido: string;
        atajo: string;
    }>;
}
