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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryProductosDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const CAMPOS_ORDENABLES = ['nombre', 'precio', 'createdAt'];
class QueryProductosDto {
    constructor() {
        this.page = 1;
        this.limit = 20;
        this.sort = 'createdAt';
        this.order = 'desc';
    }
}
exports.QueryProductosDto = QueryProductosDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryProductosDto.prototype, "categoria", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], QueryProductosDto.prototype, "marca", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Búsqueda por texto en nombre/SKU' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QueryProductosDto.prototype, "texto", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['ACTIVO', 'INACTIVO', 'SUSPENDIDO'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['ACTIVO', 'INACTIVO', 'SUSPENDIDO']),
    __metadata("design:type", String)
], QueryProductosDto.prototype, "estado", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], QueryProductosDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 20 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], QueryProductosDto.prototype, "limit", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: CAMPOS_ORDENABLES, default: 'createdAt' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(CAMPOS_ORDENABLES),
    __metadata("design:type", Object)
], QueryProductosDto.prototype, "sort", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['asc', 'desc'], default: 'desc' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['asc', 'desc']),
    __metadata("design:type", String)
], QueryProductosDto.prototype, "order", void 0);
//# sourceMappingURL=query-productos.dto.js.map