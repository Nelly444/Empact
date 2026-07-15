import { describe, expect, it } from 'vitest'
import { getThemeColor } from './themeColors'

describe('getThemeColor', () => {
  it('returns a distinct color for a known theme', () => {
    const color = getThemeColor('Education')
    expect(color.bg).toBe('#e5e0f2')
    expect(color.text).toBe('#3d3568')
  })

  it('gives every known theme a different color', () => {
    const themes = [
      'Climate Action',
      'Economic Growth',
      'Education',
      'Food Security',
      'Gender Equality',
      'Physical Health',
    ]
    const backgrounds = new Set(themes.map((theme) => getThemeColor(theme).bg))
    expect(backgrounds.size).toBe(themes.length)
  })

  it('falls back to a neutral color for an unknown theme', () => {
    expect(getThemeColor('Some New Theme')).toEqual({ bg: '#f9f3ed', text: '#6b6f79' })
  })

  it('falls back to a neutral color for null', () => {
    expect(getThemeColor(null)).toEqual({ bg: '#f9f3ed', text: '#6b6f79' })
  })
})
