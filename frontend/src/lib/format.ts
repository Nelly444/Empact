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

/**
 * Organization homepage/logo URLs come from GlobalGiving's API, not our own
 * data — only allow http(s) so a compromised or malformed record can't be
 * rendered as a javascript:/data: URI in an href or img src.
 */
export function safeHttpUrl(url: string | null): string | undefined {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:' ? url : undefined
  } catch {
    return undefined
  }
}
