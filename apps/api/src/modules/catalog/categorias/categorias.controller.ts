import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriasService } from './categorias.service';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('categorias')
@ApiBearerAuth()
@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  @Get()
  listar(@CurrentUser() user: AuthenticatedUser) {
    return this.categoriasService.listar(user.empresaId);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  crear(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateCategoriaDto,
  ) {
    return this.categoriasService.crear(user.empresaId, dto);
  }

  @Patch(':id')
  @Roles('OWNER', 'ADMIN')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: UpdateCategoriaDto,
  ) {
    return this.categoriasService.actualizar(user.empresaId, id, dto);
  }
}
