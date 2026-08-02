import { RespuestasRapidasService } from './respuestas-rapidas.service';
import { CreateRespuestaRapidaDto } from './dto/create-respuesta-rapida.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class RespuestasRapidasController {
    private readonly respuestasRapidasService;
    constructor(respuestasRapidasService: RespuestasRapidasService);
    listar(user: AuthenticatedUser): Promise<{
        empresaId: string;
        id: string;
        contenido: string;
        atajo: string;
    }[]>;
    crear(user: AuthenticatedUser, dto: CreateRespuestaRapidaDto): Promise<{
        empresaId: string;
        id: string;
        contenido: string;
        atajo: string;
    }>;
}
