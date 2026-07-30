import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Roles('OWNER', 'ADMIN')
  listar(@CurrentUser() user: AuthenticatedUser) {
    return this.usuariosService.listar(user.empresaId);
  }

  @Post()
  @Roles('OWNER')
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateUsuarioDto,
  ) {
    return this.usuariosService.crear(user.empresaId, dto);
  }

  @Patch(':id')
  @Roles('OWNER')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateUsuarioDto,
  ) {
    return this.usuariosService.actualizar(user.empresaId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER')
  desactivar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.usuariosService.desactivar(user.empresaId, id);
  }
}
