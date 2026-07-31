import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CarritosService } from './carritos.service';
import { AddItemDto } from './dto/add-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('carritos')
@ApiBearerAuth()
@Controller('carritos')
export class CarritosController {
  constructor(private readonly carritosService: CarritosService) {}

  @Get('cliente/:clienteId')
  obtenerActivo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('clienteId') clienteId: string,
  ) {
    return this.carritosService.obtenerActivoOCrear(user.empresaId, clienteId);
  }

  @Post(':id/items')
  agregarItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: AddItemDto,
  ) {
    return this.carritosService.agregarItem(user.empresaId, id, dto);
  }

  @Patch(':id/items/:itemId')
  actualizarItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.carritosService.actualizarItem(
      user.empresaId,
      id,
      itemId,
      dto,
    );
  }

  @Delete(':id/items/:itemId')
  eliminarItem(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('itemId') itemId: string,
  ) {
    return this.carritosService.eliminarItem(user.empresaId, id, itemId);
  }
}
