import {
  Body,
  Controller,
  Get,
  Param,
  ParseEnumPipe,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TipoPrompt } from '@prisma/client';
import { EmpresaService } from './empresa.service';
import { UpdateEmpresaDto } from './dto/update-empresa.dto';
import { ConfiguracionIaDto } from './dto/configuracion-ia.dto';
import { ActualizarPromptDto } from './dto/actualizar-prompt.dto';
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

  @Get('configuracion-ia')
  @Roles('OWNER', 'ADMIN')
  obtenerConfiguracionIA(@CurrentUser() user: AuthenticatedUser) {
    return this.empresaService.obtenerConfiguracionIA(user.empresaId);
  }

  @Put('configuracion-ia')
  @Roles('OWNER', 'ADMIN')
  actualizarConfiguracionIA(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ConfiguracionIaDto,
  ) {
    return this.empresaService.actualizarConfiguracionIA(user.empresaId, dto);
  }

  @Get('prompts')
  @Roles('OWNER', 'ADMIN')
  listarPrompts(@CurrentUser() user: AuthenticatedUser) {
    return this.empresaService.listarPrompts(user.empresaId);
  }

  @Put('prompts/:tipo')
  @Roles('OWNER', 'ADMIN')
  actualizarPrompt(
    @CurrentUser() user: AuthenticatedUser,
    @Param('tipo', new ParseEnumPipe(TipoPrompt)) tipo: TipoPrompt,
    @Body() dto: ActualizarPromptDto,
  ) {
    return this.empresaService.actualizarPrompt(user.empresaId, tipo, dto);
  }
}
