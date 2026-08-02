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
exports.CreateArchivoProductoDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class CreateArchivoProductoDto {
}
exports.CreateArchivoProductoDto = CreateArchivoProductoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL del archivo ya subido a MinIO/S3 (la subida multipart se resuelve en la capa de infraestructura, este endpoint solo registra el archivo)',
    }),
    (0, class_validator_1.IsUrl)({ require_tld: false }),
    __metadata("design:type", String)
], CreateArchivoProductoDto.prototype, "url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'image/jpeg' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateArchivoProductoDto.prototype, "tipoMime", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateArchivoProductoDto.prototype, "tamanoBytes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateArchivoProductoDto.prototype, "bucket", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.TipoArchivoProducto }),
    (0, class_validator_1.IsEnum)(client_1.TipoArchivoProducto),
    __metadata("design:type", String)
], CreateArchivoProductoDto.prototype, "tipo", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateArchivoProductoDto.prototype, "orden", void 0);
//# sourceMappingURL=create-archivo-producto.dto.js.map