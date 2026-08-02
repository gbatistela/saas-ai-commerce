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
exports.ConversacionesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const conversaciones_service_1 = require("./conversaciones.service");
const query_conversaciones_dto_1 = require("./dto/query-conversaciones.dto");
const query_mensajes_dto_1 = require("./dto/query-mensajes.dto");
const create_mensaje_dto_1 = require("./dto/create-mensaje.dto");
const asignar_conversacion_dto_1 = require("./dto/asignar-conversacion.dto");
const actualizar_estado_dto_1 = require("./dto/actualizar-estado.dto");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../../common/decorators/current-user.decorator");
let ConversacionesController = class ConversacionesController {
    constructor(conversacionesService) {
        this.conversacionesService = conversacionesService;
    }
    listar(user, query) {
        return this.conversacionesService.listar(user.empresaId, query);
    }
    obtener(user, id, query) {
        return this.conversacionesService.obtener(user.empresaId, id, query);
    }
    enviarMensaje(user, id, dto) {
        return this.conversacionesService.enviarMensajeManual(user.empresaId, id, dto);
    }
    asignar(user, id, dto) {
        return this.conversacionesService.asignar(user.empresaId, id, dto);
    }
    actualizarEstado(user, id, dto) {
        return this.conversacionesService.actualizarEstado(user.empresaId, id, dto);
    }
};
exports.ConversacionesController = ConversacionesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_conversaciones_dto_1.QueryConversacionesDto]),
    __metadata("design:returntype", void 0)
], ConversacionesController.prototype, "listar", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, query_mensajes_dto_1.QueryMensajesDto]),
    __metadata("design:returntype", void 0)
], ConversacionesController.prototype, "obtener", null);
__decorate([
    (0, common_1.Post)(':id/mensajes'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, create_mensaje_dto_1.CreateMensajeDto]),
    __metadata("design:returntype", void 0)
], ConversacionesController.prototype, "enviarMensaje", null);
__decorate([
    (0, common_1.Patch)(':id/asignar'),
    (0, roles_decorator_1.Roles)('OWNER', 'ADMIN'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, asignar_conversacion_dto_1.AsignarConversacionDto]),
    __metadata("design:returntype", void 0)
], ConversacionesController.prototype, "asignar", null);
__decorate([
    (0, common_1.Patch)(':id/estado'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, actualizar_estado_dto_1.ActualizarEstadoDto]),
    __metadata("design:returntype", void 0)
], ConversacionesController.prototype, "actualizarEstado", null);
exports.ConversacionesController = ConversacionesController = __decorate([
    (0, swagger_1.ApiTags)('conversaciones'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('conversaciones'),
    __metadata("design:paramtypes", [conversaciones_service_1.ConversacionesService])
], ConversacionesController);
//# sourceMappingURL=conversaciones.controller.js.map