import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class EmpresaController {
    private readonly empresaService;
    constructor(empresaService: EmpresaService);
    obtener(user: AuthenticatedUser): Promise<any>;
    actualizar(user: AuthenticatedUser, dto: UpdateEmpresaDto): Promise<any>;
}
