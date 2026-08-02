export function formatMoneda(valor: number, moneda = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}
