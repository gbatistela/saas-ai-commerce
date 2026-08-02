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
exports.AiTestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ai_test_service_1 = require("./ai-test.service");
const probar_asistente_dto_1 = require("./dto/probar-asistente.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let AiTestController = class AiTestController {
    constructor(aiTestService) {
        this.aiTestService = aiTestService;
    }
    async probar(user, dto) {
        const historial = [...(dto.historial ?? []), { emisor: 'CLIENTE', contenido: dto.mensaje }];
        const respuesta = await this.aiTestService.probar(user.empresaId, historial);
        return { respuesta };
    }
};
exports.AiTestController = AiTestController;
__decorate([
    (0, common_1.Post)('probar'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, probar_asistente_dto_1.ProbarAsistenteDto]),
    __metadata("design:returntype", Promise)
], AiTestController.prototype, "probar", null);
exports.AiTestController = AiTestController = __decorate([
    (0, swagger_1.ApiTags)('ai'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_test_service_1.AiTestService])
], AiTestController);
//# sourceMappingURL=ai-test.controller.js.map