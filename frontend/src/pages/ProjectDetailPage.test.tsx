import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError, api } from '../lib/api'
import type { ProjectDetailOut } from '../lib/types'
import ProjectDetailPage from './ProjectDetailPage'

vi.mock('../lib/api', async () => {
  const actual = await vi.importActual<typeof import('../lib/api')>('../lib/api')
  return { ...actual, api: { get: vi.fn(), post: vi.fn() } }
})

const mockedApi = vi.mocked(api)

const PROJECT: ProjectDetailOut = {
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
  project_url: 'https://www.globalgiving.org/projects/learning-centers-afghan-women/',
  impact_estimate: null,
  similarity: null,
  description_raw: 'The full raw description.',
  similar_projects: [],
}

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      </Routes>
    </MemoryRouter>,
  )
}

beforeEach(() => {
  mockedApi.get.mockReset()
})

describe('ProjectDetailPage', () => {
  it('renders the project once it loads', async () => {
    mockedApi.get.mockResolvedValue(PROJECT)
    renderAt('/projects/1')

    expect(await screen.findByRole('heading', { name: PROJECT.title })).toBeInTheDocument()
    expect(screen.getByText('The full raw description.')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /donate on globalgiving/i })
    expect(link).toHaveAttribute('href', PROJECT.project_url)
  })

  it('renders similar projects when present, and omits the section when empty', async () => {
    mockedApi.get.mockResolvedValue({
      ...PROJECT,
      similar_projects: [
        { ...PROJECT, id: 2, title: 'Afghan Institute of Learning Empowers Afghan Women', similarity: 0.63 },
      ],
    })
    renderAt('/projects/1')

    expect(await screen.findByText('Similar projects')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Afghan Institute of Learning Empowers Afghan Women' })).toBeInTheDocument()
  })

  it('omits the similar projects section when there are none', async () => {
    mockedApi.get.mockResolvedValue(PROJECT)
    renderAt('/projects/1')

    await screen.findByRole('heading', { name: PROJECT.title })
    expect(screen.queryByText('Similar projects')).not.toBeInTheDocument()
  })

  it('shows a not-found message on a 404', async () => {
    mockedApi.get.mockRejectedValue(new ApiError(404, 'not found'))
    renderAt('/projects/999')

    expect(await screen.findByText(/doesn't exist/i)).toBeInTheDocument()
  })

  it('shows a rate-limit-specific message on a 429', async () => {
    mockedApi.get.mockRejectedValue(new ApiError(429, 'too many requests'))
    renderAt('/projects/1')

    expect(await screen.findByText(/browsing a bit fast/i)).toBeInTheDocument()
  })

  it('shows a generic message for other failures', async () => {
    mockedApi.get.mockRejectedValue(new ApiError(500, 'server error'))
    renderAt('/projects/1')

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })
})
