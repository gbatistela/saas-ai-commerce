import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MarcasService } from './marcas.service';
import { CreateMarcaDto } from './dto/create-marca.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('marcas')
@ApiBearerAuth()
@Controller('marcas')
export class MarcasController {
  constructor(private readonly marcasService: MarcasService) {}

  @Get()
  listar(@CurrentUser() user: AuthenticatedUser) {
    return this.marcasService.listar(user.empresaId);
  }

  @Post()
  @Roles('OWNER', 'ADMIN')
  crear(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateMarcaDto) {
    return this.marcasService.crear(user.empresaId, dto);
  }
}
