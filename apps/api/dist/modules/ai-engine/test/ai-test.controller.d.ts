import { AiTestService } from './ai-test.service';
import { ProbarAsistenteDto } from './dto/probar-asistente.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class AiTestController {
    private readonly aiTestService;
    constructor(aiTestService: AiTestService);
    probar(user: AuthenticatedUser, dto: ProbarAsistenteDto): Promise<{
        respuesta: string;
    }>;
}
