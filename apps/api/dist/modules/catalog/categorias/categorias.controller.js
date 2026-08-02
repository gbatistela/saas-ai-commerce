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
exports.CategoriasController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const categorias_service_1 = require("./categorias.service");
const create_categoria_dto_1 = require("./dto/create-categoria.dto");
const update_categoria_dto_1 = require("./dto/update-categoria.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let CategoriasController = class CategoriasController {
    constructor(categoriasService) {
        this.categoriasService = categoriasService;
    }
    listar(user) {
        return this.categoriasService.listar(user.empresaId);
    }
    crear(user, dto) {
        return this.categoriasService.crear(user.empresaId, dto);
    }
    actualizar(user, id, dto) {
        return this.categoriasService.actualizar(user.empresaId, id, dto);
    }
};
exports.CategoriasController = CategoriasController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_categoria_dto_1.CreateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_categoria_dto_1.UpdateCategoriaDto]),
    __metadata("design:returntype", void 0)
], CategoriasController.prototype, "actualizar", null);
exports.CategoriasController = CategoriasController = __decorate([
    (0, swagger_1.ApiTags)('categorias'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('categorias'),
    __metadata("design:paramtypes", [categorias_service_1.CategoriasService])
], CategoriasController);
//# sourceMappingURL=categorias.controller.js.map