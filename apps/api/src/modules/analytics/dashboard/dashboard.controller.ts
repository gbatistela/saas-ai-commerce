import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { QueryRangoDto } from './dto/query-rango.dto';
import { QueryTopProductosDto } from './dto/query-top-productos.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import {
  CurrentUser,
  AuthenticatedUser,
} from '../../../common/decorators/current-user.decorator';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
@Roles('OWNER', 'ADMIN')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('resumen')
  resumen(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryRangoDto) {
    return this.dashboardService.resumen(user.empresaId, query);
  }

  @Get('ventas')
  ventas(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryRangoDto) {
    return this.dashboardService.ventasPorDia(user.empresaId, query);
  }

  @Get('productos-mas-vendidos')
  productosMasVendidos(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryTopProductosDto,
  ) {
    return this.dashboardService.productosMasVendidos(user.empresaId, query);
  }

  @Get('ia')
  metricasIA(@CurrentUser() user: AuthenticatedUser, @Query() query: QueryRangoDto) {
    return this.dashboardService.metricasIA(user.empresaId, query);
  }
}
