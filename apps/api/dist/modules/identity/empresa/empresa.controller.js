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
exports.EmpresaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
const empresa_service_1 = require("./empresa.service");
const update_empresa_dto_1 = require("./dto/update-empresa.dto");
const configuracion_ia_dto_1 = require("./dto/configuracion-ia.dto");
const actualizar_prompt_dto_1 = require("./dto/actualizar-prompt.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let EmpresaController = class EmpresaController {
    constructor(empresaService) {
        this.empresaService = empresaService;
    }
    obtener(user) {
        return this.empresaService.obtener(user.empresaId);
    }
    actualizar(user, dto) {
        return this.empresaService.actualizar(user.empresaId, dto);
    }
    obtenerConfiguracionIA(user) {
        return this.empresaService.obtenerConfiguracionIA(user.empresaId);
    }
    actualizarConfiguracionIA(user, dto) {
        return this.empresaService.actualizarConfiguracionIA(user.empresaId, dto);
    }
    listarPrompts(user) {
        return this.empresaService.listarPrompts(user.empresaId);
    }
    actualizarPrompt(user, tipo, dto) {
        return this.empresaService.actualizarPrompt(user.empresaId, tipo, dto);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmpresaController.prototype, "obtener", null);
__decorate([
    (0, common_1.Patch)(),
    (0, roles_decorator_1.Roles)('OWNER'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", void 0)
], EmpresaController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Get)('configuracion-ia'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmpresaController.prototype, "obtenerConfiguracionIA", null);
__decorate([
    (0, common_1.Put)('configuracion-ia'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, configuracion_ia_dto_1.ConfiguracionIaDto]),
    __metadata("design:returntype", void 0)
], EmpresaController.prototype, "actualizarConfiguracionIA", null);
__decorate([
    (0, common_1.Get)('prompts'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EmpresaController.prototype, "listarPrompts", null);
__decorate([
    (0, common_1.Put)('prompts/:tipo'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('tipo', new common_1.ParseEnumPipe(client_1.TipoPrompt))),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, actualizar_prompt_dto_1.ActualizarPromptDto]),
    __metadata("design:returntype", void 0)
], EmpresaController.prototype, "actualizarPrompt", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, swagger_1.ApiTags)('empresa'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map