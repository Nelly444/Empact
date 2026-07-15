import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { FilterOptions } from '../lib/types'
import SearchControls from './SearchControls'

const FILTER_OPTIONS: FilterOptions = {
  org_names: ['Afghan Institute of Learning'],
  home_countries: ['Armenia', 'United States'],
  themes: ['Education'],
  countries_served: ['Afghanistan', 'Bahamas'],
}

describe('SearchControls', () => {
  it('does not show "Clear filters" when no filters are set', () => {
    render(<SearchControls filterOptions={FILTER_OPTIONS} isSearching={false} onSearch={vi.fn()} />)
    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
  })

  it('shows "Clear filters" once a dropdown filter is set', async () => {
    const user = userEvent.setup()
    render(<SearchControls filterOptions={FILTER_OPTIONS} isSearching={false} onSearch={vi.fn()} />)

    await user.selectOptions(screen.getByLabelText('Home country'), 'Armenia')
    expect(screen.getByText('Clear filters')).toBeInTheDocument()
  })

  it('resets dropdown filters and re-runs the search with just the query', async () => {
    const onSearch = vi.fn()
    const user = userEvent.setup()
    render(<SearchControls filterOptions={FILTER_OPTIONS} isSearching={false} onSearch={onSearch} />)

    await user.type(screen.getByLabelText('Describe the cause you care about'), 'education for girls')
    await user.selectOptions(screen.getByLabelText('Home country'), 'Armenia')
    await user.selectOptions(screen.getByLabelText('Countries served'), 'Bahamas')

    await user.click(screen.getByText('Clear filters'))

    expect(onSearch).toHaveBeenCalledWith({ query: 'education for girls' })
    expect(screen.getByLabelText('Home country')).toHaveValue('')
    expect(screen.getByLabelText('Countries served')).toHaveValue('')
    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument()
  })
})
