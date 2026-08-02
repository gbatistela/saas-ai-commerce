export function formatMoneda(valor: number, moneda = 'ARS') {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: moneda,
    maximumFractionDigits: 0,
  }).format(valor);
}

export function formatNumero(valor: number) {
  return new Intl.NumberFormat('es-AR').format(valor);
}

export function formatPorcentaje(valor: number, digitos = 0) {
  return `${(valor * 100).toFixed(digitos)}%`;
}
