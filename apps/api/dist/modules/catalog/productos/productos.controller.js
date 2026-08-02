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
exports.ArchivosController = exports.VariantesController = exports.ProductosController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const productos_service_1 = require("./productos.service");
const create_producto_dto_1 = require("./dto/create-producto.dto");
const update_producto_dto_1 = require("./dto/update-producto.dto");
const query_productos_dto_1 = require("./dto/query-productos.dto");
const create_variante_dto_1 = require("./dto/create-variante.dto");
const update_variante_dto_1 = require("./dto/update-variante.dto");
const update_stock_dto_1 = require("./dto/update-stock.dto");
const create_archivo_producto_dto_1 = require("./dto/create-archivo-producto.dto");
const create_relacionado_dto_1 = require("./dto/create-relacionado.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let ProductosController = class ProductosController {
    constructor(productosService) {
        this.productosService = productosService;
    }
    listar(user, query) {
        return this.productosService.listar(user.empresaId, query);
    }
    obtener(user, id) {
        return this.productosService.obtener(user.empresaId, id);
    }
    crear(user, dto) {
        return this.productosService.crear(user.empresaId, dto);
    }
    actualizar(user, id, dto) {
        return this.productosService.actualizar(user.empresaId, id, dto);
    }
    eliminar(user, id) {
        return this.productosService.eliminar(user.empresaId, id);
    }
    agregarVariante(user, productoId, dto) {
        return this.productosService.agregarVariante(user.empresaId, productoId, dto);
    }
    agregarArchivo(user, productoId, dto) {
        return this.productosService.agregarArchivo(user.empresaId, productoId, dto);
    }
    vincularRelacionado(user, productoId, dto) {
        return this.productosService.vincularRelacionado(user.empresaId, productoId, dto);
    }
};
exports.ProductosController = ProductosController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_productos_dto_1.QueryProductosDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_producto_dto_1.CreateProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "crear", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_producto_dto_1.UpdateProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "eliminar", null);
__decorate([
    (0, common_1.Post)(':id/variantes'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_variante_dto_1.CreateVarianteDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "agregarVariante", null);
__decorate([
    (0, common_1.Post)(':id/archivos'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_archivo_producto_dto_1.CreateArchivoProductoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "agregarArchivo", null);
__decorate([
    (0, common_1.Post)(':id/relacionados'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_relacionado_dto_1.CreateRelacionadoDto]),
    __metadata("design:returntype", void 0)
], ProductosController.prototype, "vincularRelacionado", null);
exports.ProductosController = ProductosController = __decorate([
    (0, swagger_1.ApiTags)('productos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('productos'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ProductosController);
let VariantesController = class VariantesController {
    constructor(productosService) {
        this.productosService = productosService;
    }
    actualizar(user, id, dto) {
        return this.productosService.actualizarVariante(user.empresaId, id, dto);
    }
    actualizarStock(user, id, dto) {
        return this.productosService.actualizarStock(user.empresaId, id, dto);
    }
};
exports.VariantesController = VariantesController;
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_variante_dto_1.UpdateVarianteDto]),
    __metadata("design:returntype", void 0)
], VariantesController.prototype, "actualizar", null);
__decorate([
    (0, common_1.Patch)(':id/stock'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, update_stock_dto_1.UpdateStockDto]),
    __metadata("design:returntype", void 0)
], VariantesController.prototype, "actualizarStock", null);
exports.VariantesController = VariantesController = __decorate([
    (0, swagger_1.ApiTags)('variantes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('variantes'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], VariantesController);
let ArchivosController = class ArchivosController {
    constructor(productosService) {
        this.productosService = productosService;
    }
    eliminar(user, id) {
        return this.productosService.eliminarArchivo(user.empresaId, id);
    }
};
exports.ArchivosController = ArchivosController;
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ArchivosController.prototype, "eliminar", null);
exports.ArchivosController = ArchivosController = __decorate([
    (0, swagger_1.ApiTags)('archivos'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('archivos'),
    __metadata("design:paramtypes", [productos_service_1.ProductosService])
], ArchivosController);
//# sourceMappingURL=productos.controller.js.map