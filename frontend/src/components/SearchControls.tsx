import { Loader2, Send } from 'lucide-react'
import { useState } from 'react'
import type { FilterOptions, SearchFilters } from '../lib/types'

const selectClasses =
  'w-full truncate rounded-inputs border border-dove bg-pure-white px-16 py-8 font-sohne text-body text-ink focus:border-ink focus:outline-none'

const labelClasses = 'mb-4 block font-sohne text-caption leading-caption tracking-caption text-graphite'

interface SearchControlsProps {
  filterOptions: FilterOptions | null
  isSearching: boolean
  onSearch: (filters: SearchFilters) => void
}

function SearchControls({ filterOptions, isSearching, onSearch }: SearchControlsProps) {
  const [query, setQuery] = useState('')
  const [orgName, setOrgName] = useState('')
  const [homeCountry, setHomeCountry] = useState('')
  const [countriesServed, setCountriesServed] = useState('')
  const [themes, setThemes] = useState<string[]>([])

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    onSearch({
      query: query.trim() || undefined,
      org_name: orgName || undefined,
      home_country: homeCountry || undefined,
      countries_served: countriesServed || undefined,
      themes: themes.length > 0 ? themes : undefined,
    })
  }

  function handleThemesChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setThemes(Array.from(event.target.selectedOptions, (option) => option.value))
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl px-24 pb-64">
      <div className="flex items-center gap-8 rounded-inputs border border-dove bg-pure-white px-20 py-16 shadow-subtle">
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Describe the cause you care about — e.g. girls' education in East Africa"
          className="flex-1 border-none font-sohne text-body text-ink outline-none placeholder:text-graphite"
        />
        <button
          type="submit"
          disabled={isSearching}
          aria-label="Search"
          className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-ink text-pure-white transition-opacity disabled:opacity-50"
        >
          {isSearching ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </div>

      <div className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4">
        <div>
          <label className={labelClasses}>Organization</label>
          <select value={orgName} onChange={(event) => setOrgName(event.target.value)} className={selectClasses}>
            <option value="">All organizations</option>
            {filterOptions?.org_names.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Home country</label>
          <select
            value={homeCountry}
            onChange={(event) => setHomeCountry(event.target.value)}
            className={selectClasses}
          >
            <option value="">All home countries</option>
            {filterOptions?.home_countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Countries served</label>
          <select
            value={countriesServed}
            onChange={(event) => setCountriesServed(event.target.value)}
            className={selectClasses}
          >
            <option value="">All countries served</option>
            {filterOptions?.countries_served.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClasses}>Themes (Cmd/Ctrl-click for multiple)</label>
          <select
            multiple
            size={4}
            value={themes}
            onChange={handleThemesChange}
            className={selectClasses}
          >
            {filterOptions?.themes.map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </select>
        </div>
      </div>
    </form>
  )
}

export default SearchControls
