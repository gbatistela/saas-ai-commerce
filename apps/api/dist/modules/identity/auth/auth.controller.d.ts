import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { AuthenticatedUser } from '../../../common/decorators/current-user.decorator';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        empresa: {
            id: string;
            nombre: string;
            slug: string;
        };
        usuario: {
            id: string;
            nombre: string;
            email: string;
            rol: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        usuario: {
            id: string;
            nombre: string;
            email: string;
            rol: "OWNER" | "ADMIN" | "AGENTE";
        };
    }>;
    refresh(dto: RefreshTokenDto): Promise<import("./auth.service").TokenPair>;
    me(user: AuthenticatedUser): AuthenticatedUser;
}
