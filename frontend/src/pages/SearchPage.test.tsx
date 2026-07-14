import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, api } from '../lib/api'
import type { FilterOptions, ProjectCardOut } from '../lib/types'
import SearchPage from './SearchPage'

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api')
  return { ...actual, api: { get: vi.fn(), post: vi.fn() } }
})

const mockedApi = vi.mocked(api)

const FILTER_OPTIONS: FilterOptions = {
  org_names: ['Afghan Institute of Learning'],
  home_countries: ['United States'],
  themes: ['Education'],
  countries_served: ['Afghanistan'],
}

const PROJECT: ProjectCardOut = {
  id: 1,
  title: 'Learning Centers for Rural Afghan Women',
  theme: 'Education',
  organization: {
    id: 1,
    globalgiving_id: '372',
    name: 'Afghan Institute of Learning',
    home_country: 'United States',
    countries_served: 'Afghanistan',
    address: 'Dearborn, Michigan',
    logo_url: null,
    homepage_url: null,
  },
  summary_cached: 'A summary.',
  funding_goal: 98000,
  funding_raised: 67364,
  impact_estimate: null,
  similarity: 0.52,
}

function renderPage() {
  render(
    <MemoryRouter>
      <SearchPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockedApi.get.mockReset()
  mockedApi.post.mockReset()
  mockedApi.get.mockResolvedValue(FILTER_OPTIONS)
})

describe('SearchPage', () => {
  it('renders result cards after a successful search', async () => {
    mockedApi.post.mockResolvedValue({ results: [PROJECT] })
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalled())
    await user.click(screen.getByLabelText('Search'))

    expect(await screen.findByText('Learning Centers for Rural Afghan Women')).toBeInTheDocument()
  })

  it('shows the empty-results message when the search returns nothing', async () => {
    mockedApi.post.mockResolvedValue({ results: [] })
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalled())
    await user.click(screen.getByLabelText('Search'))

    expect(await screen.findByText(/no projects matched/i)).toBeInTheDocument()
  })

  it('shows a rate-limit-specific message on a 429 response', async () => {
    mockedApi.post.mockRejectedValue(new ApiError(429, 'too many requests'))
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalled())
    await user.click(screen.getByLabelText('Search'))

    expect(await screen.findByText(/searching a bit fast/i)).toBeInTheDocument()
  })

  it('shows a validation-specific message on a 422 response', async () => {
    mockedApi.post.mockRejectedValue(new ApiError(422, 'query too short'))
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalled())
    await user.click(screen.getByLabelText('Search'))

    expect(await screen.findByText(/bit more detail/i)).toBeInTheDocument()
  })

  it('shows a generic message for other failures', async () => {
    mockedApi.post.mockRejectedValue(new ApiError(500, 'server error'))
    const user = userEvent.setup()
    renderPage()

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalled())
    await user.click(screen.getByLabelText('Search'))

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })
})
