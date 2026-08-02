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
exports.ConfiguracionIaDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class ConfiguracionIaDto {
}
exports.ConfiguracionIaDto = ConfiguracionIaDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'cercano y profesional' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ConfiguracionIaDto.prototype, "tono", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reglas de negocio libres que el prompt del sistema debe respetar',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ConfiguracionIaDto.prototype, "reglasNegocioJson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: ['gpt-4o-mini', 'gpt-4o'], default: 'gpt-4o-mini' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['gpt-4o-mini', 'gpt-4o']),
    __metadata("design:type", String)
], ConfiguracionIaDto.prototype, "modeloOpenai", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 0.7, minimum: 0, maximum: 2 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(2),
    __metadata("design:type", Number)
], ConfiguracionIaDto.prototype, "temperature", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ default: 600 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(50),
    (0, class_validator_1.Max)(4000),
    __metadata("design:type", Number)
], ConfiguracionIaDto.prototype, "maxTokens", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Horario de atención, formato libre' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ConfiguracionIaDto.prototype, "horarioAtencionJson", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Condiciones bajo las cuales la IA debe derivar a un humano',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], ConfiguracionIaDto.prototype, "condicionesHandoffJson", void 0);
//# sourceMappingURL=configuracion-ia.dto.js.map