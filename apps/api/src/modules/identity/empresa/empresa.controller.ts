import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('empresa')
@ApiBearerAuth()
@Controller('empresa')
export class EmpresaController {
  constructor(private readonly empresaService: EmpresaService) {}

  @Get()
  @Roles('OWNER', 'ADMIN')
  obtener(@CurrentUser() user: AuthenticatedUser) {
    return this.empresaService.obtener(user.empresaId);
  }

  @Patch()
  @Roles('OWNER')
  actualizar(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateEmpresaDto,
  ) {
    return this.empresaService.actualizar(user.empresaId, dto);
  }
}
