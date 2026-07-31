import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RespuestasRapidasService } from './respuestas-rapidas.service';
import { CreateRespuestaRapidaDto } from './dto/create-respuesta-rapida.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('respuestas-rapidas')
@ApiBearerAuth()
@Controller('respuestas-rapidas')
export class RespuestasRapidasController {
  constructor(
    private readonly respuestasRapidasService: RespuestasRapidasService,
  ) {}

  @Get()
  listar(@CurrentUser() user: AuthenticatedUser) {
    return this.respuestasRapidasService.listar(user.empresaId);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateRespuestaRapidaDto,
  ) {
    return this.respuestasRapidasService.crear(user.empresaId, dto);
  }
}
