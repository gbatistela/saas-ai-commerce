import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ReclamosService } from './reclamos.service';
import { CreateReclamoDto } from './dto/create-reclamo.dto';
import { QueryReclamosDto } from './dto/query-reclamos.dto';
import { UpdateReclamoDto } from './dto/update-reclamo.dto';
import { CreateArchivoReclamoDto } from './dto/create-archivo-reclamo.dto';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('reclamos')
@ApiBearerAuth()
@Controller('reclamos')
export class ReclamosController {
  constructor(private readonly reclamosService: ReclamosService) {}

  @Post()
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateReclamoDto,
  ) {
    return this.reclamosService.crear(user.empresaId, dto);
  }

  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryReclamosDto,
  ) {
    return this.reclamosService.listar(user.empresaId, query);
  }

  @Get(':id')
  obtener(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.reclamosService.obtener(user.empresaId, id);
  }

  @Patch(':id')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateReclamoDto,
  ) {
    return this.reclamosService.actualizar(user.empresaId, id, dto);
  }

  @Post(':id/archivos')
  agregarArchivo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateArchivoReclamoDto,
  ) {
    return this.reclamosService.agregarArchivo(user.empresaId, id, dto);
  }
}
