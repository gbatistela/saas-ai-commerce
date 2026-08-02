"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dashboard_service_1 = require("./dashboard.service");
const query_rango_dto_1 = require("./dto/query-rango.dto");
const query_top_productos_dto_1 = require("./dto/query-top-productos.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let DashboardController = class DashboardController {
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    resumen(user, query) {
        return this.dashboardService.resumen(user.empresaId, query);
    }
    ventas(user, query) {
        return this.dashboardService.ventasPorDia(user.empresaId, query);
    }
    productosMasVendidos(user, query) {
        return this.dashboardService.productosMasVendidos(user.empresaId, query);
    }
    metricasIA(user, query) {
        return this.dashboardService.metricasIA(user.empresaId, query);
    }
};
exports.DashboardController = DashboardController;
__decorate([
    (0, common_1.Get)('resumen'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_rango_dto_1.QueryRangoDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "resumen", null);
__decorate([
    (0, common_1.Get)('ventas'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_rango_dto_1.QueryRangoDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "ventas", null);
__decorate([
    (0, common_1.Get)('productos-mas-vendidos'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_top_productos_dto_1.QueryTopProductosDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "productosMasVendidos", null);
__decorate([
    (0, common_1.Get)('ia'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_rango_dto_1.QueryRangoDto]),
    __metadata("design:returntype", void 0)
], DashboardController.prototype, "metricasIA", null);
exports.DashboardController = DashboardController = __decorate([
    (0, swagger_1.ApiTags)('dashboard'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('dashboard'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __metadata("design:paramtypes", [dashboard_service_1.DashboardService])
], DashboardController);
//# sourceMappingURL=dashboard.controller.js.map