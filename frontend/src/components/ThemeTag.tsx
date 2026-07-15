import { getThemeColor } from '../lib/themeColors'

interface ThemeTagProps {
  theme: string
}

function ThemeTag({ theme }: ThemeTagProps) {
  const color = getThemeColor(theme)

  return (
    <span
      className="shrink-0 rounded-tags px-12 py-4 font-sohne text-caption font-medium"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {theme}
    </span>
  )
}

export default ThemeTag
