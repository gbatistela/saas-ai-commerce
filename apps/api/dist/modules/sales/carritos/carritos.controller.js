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
exports.CarritosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const carritos_service_1 = require("./carritos.service");
const add_item_dto_1 = require("./dto/add-item.dto");
const update_item_dto_1 = require("./dto/update-item.dto");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let CarritosController = class CarritosController {
    constructor(carritosService) {
        this.carritosService = carritosService;
    }
    obtenerActivo(user, clienteId) {
        return this.carritosService.obtenerActivoOCrear(user.empresaId, clienteId);
    }
    agregarItem(user, id, dto) {
        return this.carritosService.agregarItem(user.empresaId, id, dto);
    }
    actualizarItem(user, id, itemId, dto) {
        return this.carritosService.actualizarItem(user.empresaId, id, itemId, dto);
    }
    eliminarItem(user, id, itemId) {
        return this.carritosService.eliminarItem(user.empresaId, id, itemId);
    }
};
exports.CarritosController = CarritosController;
__decorate([
    (0, common_1.Get)('cliente/:clienteId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('clienteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "obtenerActivo", null);
__decorate([
    (0, common_1.Post)(':id/items'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, add_item_dto_1.AddItemDto]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "agregarItem", null);
__decorate([
    (0, common_1.Patch)(':id/items/:itemId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('itemId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, update_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "actualizarItem", null);
__decorate([
    (0, common_1.Delete)(':id/items/:itemId'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Param)('itemId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], CarritosController.prototype, "eliminarItem", null);
exports.CarritosController = CarritosController = __decorate([
    (0, swagger_1.ApiTags)('carritos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('carritos'),
    __metadata("design:paramtypes", [carritos_service_1.CarritosService])
], CarritosController);
//# sourceMappingURL=carritos.controller.js.map