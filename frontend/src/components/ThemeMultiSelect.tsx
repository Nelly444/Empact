import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ThemeMultiSelectProps {
  themes: string[]
  selected: string[]
  onChange: (themes: string[]) => void
  labelledBy: string
}

function ThemeMultiSelect({ themes, selected, onChange, labelledBy }: ThemeMultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  function toggleTheme(theme: string) {
    onChange(selected.includes(theme) ? selected.filter((t) => t !== theme) : [...selected, theme])
  }

  const label = selected.length === 0 ? 'All themes' : selected.length === 1 ? selected[0] : `${selected.length} themes`

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={labelledBy}
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-8 truncate rounded-inputs border border-dove bg-pure-white px-16 py-8 font-sohne text-body text-ink focus:border-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
      >
        <span className="truncate">{label}</span>
        <ChevronDown size={16} className="shrink-0 text-graphite" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-10 mt-4 max-h-160 w-full overflow-y-auto rounded-inputs border border-dove bg-pure-white p-8 shadow-subtle">
          {themes.map((theme) => (
            <label
              key={theme}
              className="flex cursor-pointer items-start gap-8 rounded-images px-8 py-4 font-sohne text-body text-ink hover:bg-fog"
            >
              <input
                type="checkbox"
                checked={selected.includes(theme)}
                onChange={() => toggleTheme(theme)}
                className="mt-4"
              />
              {theme}
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeMultiSelect
