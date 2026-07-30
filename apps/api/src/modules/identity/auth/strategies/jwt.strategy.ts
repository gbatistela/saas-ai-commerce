import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthenticatedUser } from '../../../../common/decorators/current-user.decorator';

interface JwtPayload {
  sub: string; // userId
  empresaId: string;
  email: string;
  rol: 'OWNER' | 'ADMIN' | 'AGENTE';
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  // El valor de retorno se inyecta automáticamente en request.user
  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    return {
      userId: payload.sub,
      empresaId: payload.empresaId,
      email: payload.email,
      rol: payload.rol,
    };
  }
}
