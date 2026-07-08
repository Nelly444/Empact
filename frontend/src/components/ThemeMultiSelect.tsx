import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ThemeMultiSelectProps {
  themes: string[]
  selected: string[]
  onChange: (themes: string[]) => void
}

function ThemeMultiSelect({ themes, selected, onChange }: ThemeMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function toggleTheme(theme: string) {
    onChange(selected.includes(theme) ? selected.filter((t) => t !== theme) : [...selected, theme])
  }

  const label = selected.length === 0 ? 'All themes' : selected.length === 1 ? selected[0] : `${selected.length} themes`

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-8 truncate rounded-inputs border border-dove bg-pure-white px-16 py-8 font-sohne text-body text-ink focus:border-ink focus:outline-none"
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={16} className="shrink-0 text-graphite" />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-4 max-h-160 w-full overflow-y-auto rounded-inputs border border-dove bg-pure-white p-8 shadow-subtle">
          {themes.map((theme) => (
            <label
              key={theme}
              className="flex cursor-pointer items-center gap-8 rounded-images px-8 py-4 font-sohne text-body text-ink hover:bg-fog"
            >
              <input type="checkbox" checked={selected.includes(theme)} onChange={() => toggleTheme(theme)} />
              {theme}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeMultiSelect
