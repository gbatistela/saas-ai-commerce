"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVarianteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_variante_dto_1 = require("./create-variante.dto");
class UpdateVarianteDto extends (0, swagger_1.PartialType)(create_variante_dto_1.CreateVarianteDto) {
}
exports.UpdateVarianteDto = UpdateVarianteDto;
//# sourceMappingURL=update-variante.dto.js.map