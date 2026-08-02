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
exports.WebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const webhooks_service_1 = require("./webhooks.service");
const public_decorator_1 = require("../../../common/decorators/public.decorator");
let WebhooksController = class WebhooksController {
    constructor(webhooksService, configService) {
        this.webhooksService = webhooksService;
        this.configService = configService;
    }
    async whatsapp(body, apikey, tokenQuery) {
        const tokenEsperado = this.configService.get('channels.evolutionWebhookToken');
        if (tokenEsperado && apikey !== tokenEsperado && tokenQuery !== tokenEsperado) {
            throw new common_1.UnauthorizedException('Token de Evolution API inválido');
        }
        await this.webhooksService.procesarWhatsapp(body);
        return { received: true };
    }
    verificarInstagram(query, res) {
        const tokenEsperado = this.configService.get('channels.instagramVerifyToken') ?? '';
        const challenge = this.webhooksService.verificarHandshakeInstagram(query, tokenEsperado);
        if (challenge === null) {
            res.status(common_1.HttpStatus.FORBIDDEN).send();
            return;
        }
        res.status(common_1.HttpStatus.OK).send(challenge);
    }
    async instagram(body) {
        await this.webhooksService.procesarInstagram(body);
        return { received: true };
    }
};
exports.WebhooksController = WebhooksController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('whatsapp'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)('apikey')),
    __param(2, (0, common_1.Query)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "whatsapp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('instagram'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], WebhooksController.prototype, "verificarInstagram", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('instagram'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebhooksController.prototype, "instagram", null);
exports.WebhooksController = WebhooksController = __decorate([
    (0, swagger_1.ApiExcludeController)(),
    (0, common_1.Controller)('webhooks'),
    __metadata("design:paramtypes", [webhooks_service_1.WebhooksService,
        config_1.ConfigService])
], WebhooksController);
//# sourceMappingURL=webhooks.controller.js.map