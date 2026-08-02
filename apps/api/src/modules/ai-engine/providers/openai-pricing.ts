/**
 * Precios aproximados de OpenAI en USD por cada 1M de tokens. Son una
 * referencia para estimar costo en LogIA/el dashboard de IA, no un dato
 * facturado en tiempo real — hay que revisarlos contra
 * https://openai.com/api/pricing cuando cambien.
 */
const PRECIOS_POR_MILLON: Record<string, { input: number; output: number }> = {
  'gpt-4o-mini': { input: 0.15, output: 0.6 },
  'gpt-4o': { input: 2.5, output: 10 },
};

const DEFAULT_PRECIO = PRECIOS_POR_MILLON['gpt-4o-mini'];

export function estimarCostoUsd(
  modelo: string,
  tokensPrompt: number,
  tokensCompletion: number,
): number {
  const precio = PRECIOS_POR_MILLON[modelo] ?? DEFAULT_PRECIO;
  return (
    (tokensPrompt / 1_000_000) * precio.input +
    (tokensCompletion / 1_000_000) * precio.output
  );
}
