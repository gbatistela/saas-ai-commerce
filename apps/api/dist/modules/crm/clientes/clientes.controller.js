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
exports.ClientesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const clientes_service_1 = require("./clientes.service");
const create_cliente_dto_1 = require("./dto/create-cliente.dto");
const update_cliente_dto_1 = require("./dto/update-cliente.dto");
const query_clientes_dto_1 = require("./dto/query-clientes.dto");
const create_direccion_dto_1 = require("./dto/create-direccion.dto");
const query_historial_dto_1 = require("./dto/query-historial.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let ClientesController = class ClientesController {
    constructor(clientesService) {
        this.clientesService = clientesService;
    }
    listar(user, query) {
        return this.clientesService.listar(user.empresaId, query);
    }
    obtener(user, id) {
        return this.clientesService.obtener(user.empresaId, id);
    }
    crear(user, dto) {
        return this.clientesService.crear(user.empresaId, dto);
    }
    actualizar(user, id, dto) {
        return this.clientesService.actualizar(user.empresaId, id, dto);
    }
    agregarDireccion(user, id, dto) {
        return this.clientesService.agregarDireccion(user.empresaId, id, dto);
    }
    historial(user, id, query) {
        return this.clientesService.historial(user.empresaId, id, query);
    }
};
exports.ClientesController = ClientesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_clientes_dto_1.QueryClientesDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_cliente_dto_1.CreateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_cliente_dto_1.UpdateClienteDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Post)(':id/direcciones'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_direccion_dto_1.CreateDireccionDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "agregarDireccion", null);
__decorate([
    (0, common_1.Get)(':id/historial'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, query_historial_dto_1.QueryHistorialDto]),
    __metadata("design:returntype", void 0)
], ClientesController.prototype, "historial", null);
exports.ClientesController = ClientesController = __decorate([
    (0, swagger_1.ApiTags)('clientes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('clientes'),
    __metadata("design:paramtypes", [clientes_service_1.ClientesService])
], ClientesController);
//# sourceMappingURL=clientes.controller.js.map