import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { QueryProductosDto } from './dto/query-productos.dto';
import { CreateVarianteDto } from './dto/create-variante.dto';
import { UpdateVarianteDto } from './dto/update-variante.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { CreateArchivoProductoDto } from './dto/create-archivo-producto.dto';
import { CreateRelacionadoDto } from './dto/create-relacionado.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('productos')
@ApiBearerAuth()
@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Get()
  listar(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryProductosDto,
  ) {
    return this.productosService.listar(user.empresaId, query);
  }

  @Get(':id')
  obtener(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.productosService.obtener(user.empresaId, id);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateProductoDto,
  ) {
    return this.productosService.crear(user.empresaId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.productosService.actualizar(user.empresaId, id, dto);
  }

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  eliminar(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.productosService.eliminar(user.empresaId, id);
  }

  @Post(':id/variantes')
  @Roles('OWNER', 'ADMIN')
  agregarVariante(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productoId: string,
    @Body() dto: CreateVarianteDto,
  ) {
    return this.productosService.agregarVariante(
      user.empresaId,
      productoId,
      dto,
    );
  }

  @Post(':id/archivos')
  @Roles('OWNER', 'ADMIN')
  agregarArchivo(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productoId: string,
    @Body() dto: CreateArchivoProductoDto,
  ) {
    return this.productosService.agregarArchivo(
      user.empresaId,
      productoId,
      dto,
    );
  }

  @Post(':id/relacionados')
  @Roles('OWNER', 'ADMIN')
  vincularRelacionado(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') productoId: string,
    @Body() dto: CreateRelacionadoDto,
  ) {
    return this.productosService.vincularRelacionado(
      user.empresaId,
      productoId,
      dto,
    );
  }
}

@ApiTags('variantes')
@ApiBearerAuth()
@Controller('variantes')
export class VariantesController {
  constructor(private readonly productosService: ProductosService) {}

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateVarianteDto,
  ) {
    return this.productosService.actualizarVariante(user.empresaId, id, dto);
  }

  @Patch(':id/stock')
  @Roles('OWNER', 'ADMIN')
  actualizarStock(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateStockDto,
  ) {
    return this.productosService.actualizarStock(user.empresaId, id, dto);
  }
}

@ApiTags('archivos')
@ApiBearerAuth()
@Controller('archivos')
export class ArchivosController {
  constructor(private readonly productosService: ProductosService) {}

  @Delete(':id')
  @Roles('OWNER', 'ADMIN')
  eliminar(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.productosService.eliminarArchivo(user.empresaId, id);
  }
}
