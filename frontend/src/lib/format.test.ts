import { describe, expect, it } from 'vitest'
import { formatCurrency, formatPercent, initials, safeHttpUrl } from './format'

describe('formatCurrency', () => {
  it('formats a positive amount as whole-dollar USD', () => {
    expect(formatCurrency(67364.43)).toBe('$67,364')
  })

  it('renders null as an em dash', () => {
    expect(formatCurrency(null)).toBe('—')
  })

  it('formats zero as $0, not the null placeholder', () => {
    expect(formatCurrency(0)).toBe('$0')
  })
})

describe('formatPercent', () => {
  it('rounds to the nearest whole percent', () => {
    expect(formatPercent(68.7)).toBe('69%')
  })

  it('caps display at 100% even if the raw value exceeds it', () => {
    expect(formatPercent(142)).toBe('100%')
  })
})

describe('initials', () => {
  it('takes the first letter of the first and last word', () => {
    expect(initials('Afghan Institute of Learning')).toBe('AL')
  })

  it('handles a single-word name', () => {
    expect(initials('GlobalGiving')).toBe('G')
  })

  it('collapses repeated internal whitespace', () => {
    expect(initials('  Cure   Blindness  Project  ')).toBe('CP')
  })
})

describe('safeHttpUrl', () => {
  it('allows http and https URLs through unchanged', () => {
    expect(safeHttpUrl('https://example.org')).toBe('https://example.org')
    expect(safeHttpUrl('http://example.org')).toBe('http://example.org')
  })

  it('rejects javascript: URIs', () => {
    expect(safeHttpUrl('javascript:alert(1)')).toBeUndefined()
  })

  it('rejects data: URIs', () => {
    expect(safeHttpUrl('data:text/html,<script>alert(1)</script>')).toBeUndefined()
  })

  it('returns undefined for null', () => {
    expect(safeHttpUrl(null)).toBeUndefined()
  })

  it('returns undefined for unparseable input instead of throwing', () => {
    expect(safeHttpUrl('not a url')).toBeUndefined()
  })
})
