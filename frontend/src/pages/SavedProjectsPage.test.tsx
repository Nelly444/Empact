import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { toggleSavedProject } from '../lib/savedProjects'
import type { ProjectCardOut } from '../lib/types'
import SavedProjectsPage from './SavedProjectsPage'

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
  project_url: null,
  impact_estimate: null,
  similarity: null,
}

function renderPage() {
  render(
    <MemoryRouter>
      <SavedProjectsPage />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('SavedProjectsPage', () => {
  it('shows an empty state with a link back to browsing when nothing is saved', () => {
    renderPage()
    expect(screen.getByText(/haven't saved any projects yet/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /browse projects/i })).toHaveAttribute('href', '/')
  })

  it('renders saved projects instead of the empty state', () => {
    toggleSavedProject(PROJECT)
    renderPage()
    expect(screen.getByRole('heading', { name: PROJECT.title })).toBeInTheDocument()
    expect(screen.queryByText(/haven't saved any projects yet/i)).not.toBeInTheDocument()
  })
})
