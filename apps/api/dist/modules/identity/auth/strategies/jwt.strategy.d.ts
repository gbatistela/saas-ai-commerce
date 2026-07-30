import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../../../common/decorators/current-user.decorator';
interface JwtPayload {
    sub: string;
    empresaId: string;
    email: string;
    rol: 'OWNER' | 'ADMIN' | 'AGENTE';
}
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    constructor(configService: ConfigService);
    validate(payload: JwtPayload): Promise<AuthenticatedUser>;
}
export {};
