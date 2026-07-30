import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../infra/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
interface TokenPair {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        empresa: {
            id: any;
            nombre: any;
            slug: any;
        };
        usuario: {
            id: any;
            nombre: any;
            email: any;
            rol: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        usuario: {
            id: any;
            nombre: any;
            email: any;
            rol: "OWNER" | "ADMIN" | "AGENTE";
        };
    }>;
    refresh(refreshToken: string): Promise<TokenPair>;
    private generarTokens;
    private obtenerRolPrincipal;
    private generarSlug;
    private asegurarSlugUnico;
}
export {};
