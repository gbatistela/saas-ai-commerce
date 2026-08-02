import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StorefrontService } from './storefront.service';
import { QueryStorefrontProductosDto } from './dto/query-storefront-productos.dto';
import { AddCarritoItemDto } from './dto/add-carrito-item.dto';
import { UpdateCarritoItemStorefrontDto } from './dto/update-carrito-item.dto';
import { CheckoutStorefrontDto } from './dto/checkout.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('storefront')
@Public()
@Controller('storefront/:empresaSlug')
export class StorefrontController {
  constructor(private readonly storefrontService: StorefrontService) {}

  @Get()
  obtenerInfo(@Param('empresaSlug') slug: string) {
    return this.storefrontService.obtenerInfo(slug);
  }

  @Get('productos')
  listarProductos(
    @Param('empresaSlug') slug: string,
    @Query() query: QueryStorefrontProductosDto,
  ) {
    return this.storefrontService.listarProductos(slug, query);
  }

  @Get('productos/:id')
  obtenerProducto(@Param('empresaSlug') slug: string, @Param('id') id: string) {
    return this.storefrontService.obtenerProducto(slug, id);
  }

  @Get('categorias')
  listarCategorias(@Param('empresaSlug') slug: string) {
    return this.storefrontService.listarCategorias(slug);
  }

  @Get('carrito')
  obtenerCarrito(@Param('empresaSlug') slug: string, @Query('sessionId') sessionId: string) {
    if (!sessionId) throw new BadRequestException('sessionId es requerido');
    return this.storefrontService.obtenerCarrito(slug, sessionId);
  }

  @Post('carrito')
  agregarItem(@Param('empresaSlug') slug: string, @Body() dto: AddCarritoItemDto) {
    return this.storefrontService.agregarItem(slug, dto);
  }

  @Patch('carrito/items/:itemId')
  actualizarItem(
    @Param('empresaSlug') slug: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCarritoItemStorefrontDto,
  ) {
    return this.storefrontService.actualizarItem(slug, itemId, dto);
  }

  @Delete('carrito/items/:itemId')
  eliminarItem(
    @Param('empresaSlug') slug: string,
    @Param('itemId') itemId: string,
    @Query('sessionId') sessionId: string,
  ) {
    if (!sessionId) throw new BadRequestException('sessionId es requerido');
    return this.storefrontService.eliminarItem(slug, itemId, sessionId);
  }

  @Post('checkout')
  checkout(@Param('empresaSlug') slug: string, @Body() dto: CheckoutStorefrontDto) {
    return this.storefrontService.checkout(slug, dto);
  }

  @Get('pedidos/:numeroPedido')
  estadoPedido(
    @Param('empresaSlug') slug: string,
    @Param('numeroPedido') numeroPedido: string,
    @Query('contacto') contacto: string,
  ) {
    if (!contacto) throw new BadRequestException('contacto (email o teléfono) es requerido');
    return this.storefrontService.estadoPedido(slug, numeroPedido, contacto);
  }
}
