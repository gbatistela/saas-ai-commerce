import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ConversacionesService } from './conversaciones.service';
import { QueryConversacionesDto } from './dto/query-conversaciones.dto';
import { QueryMensajesDto } from './dto/query-mensajes.dto';
import { CreateMensajeDto } from './dto/create-mensaje.dto';
import { AsignarConversacionDto } from './dto/asignar-conversacion.dto';
import { ActualizarEstadoDto } from './dto/actualizar-estado.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('conversaciones')
@ApiBearerAuth()
@Controller('conversaciones')
export class ConversacionesController {
  constructor(private readonly conversacionesService: ConversacionesService) {}

  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryConversacionesDto,
  ) {
    return this.conversacionesService.listar(user.empresaId, query);
  }

  @Get(':id')
  obtener(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query() query: QueryMensajesDto,
  ) {
    return this.conversacionesService.obtener(user.empresaId, id, query);
  }

  @Post(':id/mensajes')
  enviarMensaje(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateMensajeDto,
  ) {
    return this.conversacionesService.enviarMensajeManual(
      user.empresaId,
      id,
      dto,
    );
  }

  @Patch(':id/asignar')
  @Roles('OWNER', 'ADMIN')
  asignar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AsignarConversacionDto,
  ) {
    return this.conversacionesService.asignar(user.empresaId, id, dto);
  }

  @Patch(':id/estado')
  actualizarEstado(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ActualizarEstadoDto,
  ) {
    return this.conversacionesService.actualizarEstado(
      user.empresaId,
      id,
      dto,
    );
  }
}
