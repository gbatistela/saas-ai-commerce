"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespuestasRapidasModule = void 0;
const common_1 = require("@nestjs/common");
const respuestas_rapidas_controller_1 = require("./respuestas-rapidas.controller");
const respuestas_rapidas_service_1 = require("./respuestas-rapidas.service");
let RespuestasRapidasModule = class RespuestasRapidasModule {
};
exports.RespuestasRapidasModule = RespuestasRapidasModule;
exports.RespuestasRapidasModule = RespuestasRapidasModule = __decorate([
    (0, common_1.Module)({
        controllers: [respuestas_rapidas_controller_1.RespuestasRapidasController],
        providers: [respuestas_rapidas_service_1.RespuestasRapidasService],
        exports: [respuestas_rapidas_service_1.RespuestasRapidasService],
    })
], RespuestasRapidasModule);
//# sourceMappingURL=respuestas-rapidas.module.js.map