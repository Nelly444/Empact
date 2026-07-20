import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Hero from '../components/Hero'
import ResultCard from '../components/ResultCard'
import SearchControls from '../components/SearchControls'
import { ApiError, api } from '../lib/api'
import type { FilterOptions, ProjectCardOut, SearchFilters } from '../lib/types'

function describeError(err: unknown, fallback: string): string {
  if (err instanceof ApiError && err.status === 429) {
    return "You're searching a bit fast — wait a moment and try again."
  }
  if (err instanceof ApiError && err.status === 422) {
    return 'Try describing your cause in a bit more detail.'
  }
  return fallback
}

function SearchPage() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [filterOptionsError, setFilterOptionsError] = useState<string | null>(null)
  const [results, setResults] = useState<ProjectCardOut[] | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function loadFilterOptions() {
    setFilterOptionsError(null)
    api
      .get<FilterOptions>('/organizations/filter-options')
      .then(setFilterOptions)
      .catch((err: unknown) => {
        setFilterOptionsError(describeError(err, 'Something went wrong loading filters.'))
      })
  }

  async function handleSearch(filters: SearchFilters) {
    setIsSearching(true)
    setError(null)
    try {
      const response = await api.post<{ results: ProjectCardOut[] }>('/search', filters)
      setResults(response.results)
    } catch (err) {
      setError(describeError(err, 'Something went wrong with your search. Please try again in a moment.'))
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    loadFilterOptions()
    handleSearch({})
  }, [])

  return (
    <main className="min-h-[calc(100vh-64px)] bg-fog">
      <Hero />
      <SearchControls filterOptions={filterOptions} isSearching={isSearching} onSearch={handleSearch} />

      {filterOptionsError && (
        <p className="mx-auto max-w-3xl px-24 pb-32 text-center font-sohne text-body text-rust">
          {filterOptionsError}{' '}
          <button type="button" onClick={loadFilterOptions} className="underline hover:text-ink">
            Retry
          </button>
        </p>
      )}

      {error && (
        <p className="mx-auto max-w-3xl px-24 pb-96 text-center font-sohne text-body text-rust">
          {error}
        </p>
      )}

      {isSearching && !results && (
        <div className="flex justify-center pb-96">
          <Loader2 size={24} className="animate-spin text-graphite" />
        </div>
      )}

      {results && (
        <div className="mx-auto max-w-6xl px-24 pb-96">
          {results.length === 0 ? (
            <p className="text-center font-sohne text-body text-ash">
              No projects matched — try a different description or fewer filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
              {results.map((project, index) => (
                <ResultCard key={project.id} project={project} index={index} />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  )
}

export default SearchPage
