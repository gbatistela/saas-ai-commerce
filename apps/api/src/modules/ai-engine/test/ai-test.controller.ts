import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AiTestService } from './ai-test.service';
import { ProbarAsistenteDto } from './dto/probar-asistente.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('ai')
@ApiBearerAuth()
@Controller('ai')
export class AiTestController {
  constructor(private readonly aiTestService: AiTestService) {}

  @Post('probar')
  @Roles('OWNER', 'ADMIN')
  async probar(@CurrentUser() user: AuthenticatedUser, @Body() dto: ProbarAsistenteDto) {
    const historial = [...(dto.historial ?? []), { emisor: 'CLIENTE' as const, contenido: dto.mensaje }];
    const respuesta = await this.aiTestService.probar(user.empresaId, historial);
    return { respuesta };
  }
}
