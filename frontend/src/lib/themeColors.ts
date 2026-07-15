interface ThemeColor {
  bg: string
  text: string
}

// A muted, editorial color per GlobalGiving theme category — distinct from
// Rust/Apricot Wash/Sky Wash, which stay reserved for funding-data meaning
// (progress bars, impact estimates) so a tag never gets confused with a
// data callout that happens to share its color.
const THEME_COLORS: Record<string, ThemeColor> = {
  'Climate Action': { bg: '#e1ead9', text: '#2f5233' },
  'Economic Growth': { bg: '#f4e8c8', text: '#7a5a12' },
  Education: { bg: '#e5e0f2', text: '#3d3568' },
  'Food Security': { bg: '#f5dcdc', text: '#8f2d2d' },
  'Gender Equality': { bg: '#f2dde9', text: '#7a2d54' },
  'Physical Health': { bg: '#d9ecea', text: '#1f5f5a' },
}

const FALLBACK_COLOR: ThemeColor = { bg: '#f9f3ed', text: '#6b6f79' }

export function getThemeColor(theme: string | null): ThemeColor {
  if (!theme) return FALLBACK_COLOR
  return THEME_COLORS[theme] ?? FALLBACK_COLOR
}
