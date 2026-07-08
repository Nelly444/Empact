import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import ResultCard from '../components/ResultCard'
import SearchControls from '../components/SearchControls'
import { api } from '../lib/api'
import type { FilterOptions, ProjectCardOut, SearchFilters } from '../lib/types'

function SearchPage() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [results, setResults] = useState<ProjectCardOut[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get<FilterOptions>('/organizations/filter-options').then(setFilterOptions).catch(() => {
      setError('Could not load filter options — is the backend running?')
    })
  }, [])

  async function handleSearch(filters: SearchFilters) {
    setIsSearching(true)
    setError(null)
    try {
      const response = await api.post<{ results: ProjectCardOut[] }>('/search', filters)
      setResults(response.results)
    } catch {
      setError('Search failed — is the backend running?')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-fog">
      <Hero />
      <SearchControls filterOptions={filterOptions} isSearching={isSearching} onSearch={handleSearch} />

      {error && (
        <p className="mx-auto max-w-3xl px-24 pb-64 text-center font-sohne text-body text-rust">
          {error}
        </p>
      )}

      {results && (
        <div className="mx-auto max-w-3xl px-24 pb-96">
          {results.length === 0 ? (
            <p className="text-center font-sohne text-body text-ash">
              No projects matched — try a different description or fewer filters.
            </p>
          ) : (
            <div className="flex flex-col gap-16">
              {results.map((project) => (
                <ResultCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default SearchPage
