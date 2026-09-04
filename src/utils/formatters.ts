export function formatCurrency(value: number, includeDecimals = false): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0,
  }).format(value);
}

export function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    const millions = value / 1_000_000;
    return `$${millions.toFixed(millions % 1 === 0 ? 0 : 2)} MDP`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return formatCurrency(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Calcula la tasa predeterminada de la escala:
 * 1 MDP = 8.0%
 * 10 MDP = 12.0%
 * Interpolación lineal entre 1M y 10M
 */
export function calcularTasaEscala(monto: number): number {
  const minMonto = 1_000_000;
  const maxMonto = 10_000_000;
  const minTasa = 8.0;
  const maxTasa = 12.0;

  if (monto <= minMonto) return minTasa;
  if (monto >= maxMonto) return maxTasa;

  const ratio = (monto - minMonto) / (maxMonto - minMonto);
  return Number((minTasa + ratio * (maxTasa - minTasa)).toFixed(2));
}
