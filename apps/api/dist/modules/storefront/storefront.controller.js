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
exports.StorefrontController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const storefront_service_1 = require("./storefront.service");
const query_storefront_productos_dto_1 = require("./dto/query-storefront-productos.dto");
const add_carrito_item_dto_1 = require("./dto/add-carrito-item.dto");
const update_carrito_item_dto_1 = require("./dto/update-carrito-item.dto");
const checkout_dto_1 = require("./dto/checkout.dto");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let StorefrontController = class StorefrontController {
    constructor(storefrontService) {
        this.storefrontService = storefrontService;
    }
    obtenerInfo(slug) {
        return this.storefrontService.obtenerInfo(slug);
    }
    listarProductos(slug, query) {
        return this.storefrontService.listarProductos(slug, query);
    }
    obtenerProducto(slug, id) {
        return this.storefrontService.obtenerProducto(slug, id);
    }
    listarCategorias(slug) {
        return this.storefrontService.listarCategorias(slug);
    }
    obtenerCarrito(slug, sessionId) {
        if (!sessionId)
            throw new common_1.BadRequestException('sessionId es requerido');
        return this.storefrontService.obtenerCarrito(slug, sessionId);
    }
    agregarItem(slug, dto) {
        return this.storefrontService.agregarItem(slug, dto);
    }
    actualizarItem(slug, itemId, dto) {
        return this.storefrontService.actualizarItem(slug, itemId, dto);
    }
    eliminarItem(slug, itemId, sessionId) {
        if (!sessionId)
            throw new common_1.BadRequestException('sessionId es requerido');
        return this.storefrontService.eliminarItem(slug, itemId, sessionId);
    }
    checkout(slug, dto) {
        return this.storefrontService.checkout(slug, dto);
    }
    estadoPedido(slug, numeroPedido, contacto) {
        if (!contacto)
            throw new common_1.BadRequestException('contacto (email o teléfono) es requerido');
        return this.storefrontService.estadoPedido(slug, numeroPedido, contacto);
    }
};
exports.StorefrontController = StorefrontController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "obtenerInfo", null);
__decorate([
    (0, common_1.Get)('productos'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, query_storefront_productos_dto_1.QueryStorefrontProductosDto]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "listarProductos", null);
__decorate([
    (0, common_1.Get)('productos/:id'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "obtenerProducto", null);
__decorate([
    (0, common_1.Get)('categorias'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "listarCategorias", null);
__decorate([
    (0, common_1.Get)('carrito'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "obtenerCarrito", null);
__decorate([
    (0, common_1.Post)('carrito'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, add_carrito_item_dto_1.AddCarritoItemDto]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "agregarItem", null);
__decorate([
    (0, common_1.Patch)('carrito/items/:itemId'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, update_carrito_item_dto_1.UpdateCarritoItemStorefrontDto]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "actualizarItem", null);
__decorate([
    (0, common_1.Delete)('carrito/items/:itemId'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Param)('itemId')),
    __param(2, (0, common_1.Query)('sessionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "eliminarItem", null);
__decorate([
    (0, common_1.Post)('checkout'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, checkout_dto_1.CheckoutStorefrontDto]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "checkout", null);
__decorate([
    (0, common_1.Get)('pedidos/:numeroPedido'),
    __param(0, (0, common_1.Param)('empresaSlug')),
    __param(1, (0, common_1.Param)('numeroPedido')),
    __param(2, (0, common_1.Query)('contacto')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], StorefrontController.prototype, "estadoPedido", null);
exports.StorefrontController = StorefrontController = __decorate([
    (0, swagger_1.ApiTags)('storefront'),
    (0, public_decorator_1.Public)(),
    (0, common_1.Controller)('storefront/:empresaSlug'),
    __metadata("design:paramtypes", [storefront_service_1.StorefrontService])
], StorefrontController);
//# sourceMappingURL=storefront.controller.js.map