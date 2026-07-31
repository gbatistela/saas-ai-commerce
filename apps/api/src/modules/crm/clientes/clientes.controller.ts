import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { QueryClientesDto } from './dto/query-clientes.dto';
import { CreateDireccionDto } from './dto/create-direccion.dto';
import { QueryHistorialDto } from './dto/query-historial.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('clientes')
@ApiBearerAuth()
@Controller('clientes')
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryClientesDto,
  ) {
    return this.clientesService.listar(user.empresaId, query);
  }

  @Get(':id')
  obtener(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.clientesService.obtener(user.empresaId, id);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateClienteDto,
  ) {
    return this.clientesService.crear(user.empresaId, dto);
  }

  @Patch(':id')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateClienteDto,
  ) {
    return this.clientesService.actualizar(user.empresaId, id, dto);
  }

  @Post(':id/direcciones')
  agregarDireccion(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateDireccionDto,
  ) {
    return this.clientesService.agregarDireccion(user.empresaId, id, dto);
  }

  @Get(':id/historial')
  historial(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query() query: QueryHistorialDto,
  ) {
    return this.clientesService.historial(user.empresaId, id, query);
  }
}
