const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function formatCurrency(amount: number | null): string {
  if (amount === null) return '—'
  return currencyFormatter.format(amount)
}

export function formatPercent(value: number): string {
  return `${Math.min(value, 100).toFixed(0)}%`
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/)
  const first = words[0]?.[0] ?? ''
  const second = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : ''
  return (first + second).toUpperCase()
}
