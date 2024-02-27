export function formatNumber(value: any): any {
  return typeof value === 'number' && value % 1 != 0 ? (Math.round(value * 100) / 100).toFixed(2) : value
}
