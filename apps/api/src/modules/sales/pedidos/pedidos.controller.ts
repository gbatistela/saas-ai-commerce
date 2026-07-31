import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PedidosService } from './pedidos.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { QueryPedidosDto } from './dto/query-pedidos.dto';
import { ActualizarEstadoPedidoDto } from './dto/actualizar-estado-pedido.dto';
import { CreateSeguimientoDto } from './dto/create-seguimiento.dto';
import { Public } from '../../../common/decorators/public.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('pedidos')
@ApiBearerAuth()
@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreatePedidoDto,
  ) {
    return this.pedidosService.crearDesdeCarrito(
      user.empresaId,
      dto,
      user.userId,
    );
  }

  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryPedidosDto,
  ) {
    return this.pedidosService.listar(user.empresaId, query);
  }

  @Public()
  @Get('numero/:numeroPedido/estado')
  @ApiQuery({
    name: 'empresaId',
    required: true,
    description:
      'Sin JWT no hay forma de saber a qué empresa pertenece el número de pedido; para consulta pública real desde la tienda se usa el endpoint de Storefront (con el slug en la URL). Este existe sobre todo para uso interno del AI Engine.',
  })
  estadoPublico(
    @Param('numeroPedido') numeroPedido: string,
    @Query('empresaId') empresaId: string,
  ) {
    if (!empresaId) {
      throw new BadRequestException('empresaId es requerido');
    }
    return this.pedidosService.estadoPorNumero(empresaId, numeroPedido);
  }

  @Get(':id')
  obtener(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.pedidosService.obtener(user.empresaId, id);
  }

  @Patch(':id/estado')
  actualizarEstado(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: ActualizarEstadoPedidoDto,
  ) {
    return this.pedidosService.actualizarEstado(
      user.empresaId,
      id,
      dto,
      user.userId,
    );
  }

  @Post(':id/seguimiento')
  @Roles('OWNER', 'ADMIN')
  agregarSeguimiento(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateSeguimientoDto,
  ) {
    return this.pedidosService.agregarSeguimiento(user.empresaId, id, dto);
  }
}
