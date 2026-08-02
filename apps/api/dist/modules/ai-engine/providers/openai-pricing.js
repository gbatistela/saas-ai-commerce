"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.estimarCostoUsd = estimarCostoUsd;
const PRECIOS_POR_MILLON = {
    'gpt-4o-mini': { input: 0.15, output: 0.6 },
    'gpt-4o': { input: 2.5, output: 10 },
};
const DEFAULT_PRECIO = PRECIOS_POR_MILLON['gpt-4o-mini'];
function estimarCostoUsd(modelo, tokensPrompt, tokensCompletion) {
    const precio = PRECIOS_POR_MILLON[modelo] ?? DEFAULT_PRECIO;
    return ((tokensPrompt / 1_000_000) * precio.input +
        (tokensCompletion / 1_000_000) * precio.output);
}
//# sourceMappingURL=openai-pricing.js.map