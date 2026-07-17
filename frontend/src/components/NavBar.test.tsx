import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { toggleSavedProject } from '../lib/savedProjects'
import type { ProjectCardOut } from '../lib/types'
import NavBar from './NavBar'

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

function renderNavBar() {
  render(
    <MemoryRouter>
      <NavBar />
    </MemoryRouter>,
  )
}

beforeEach(() => {
  localStorage.clear()
})

describe('NavBar', () => {
  it('shows no saved-count badge when nothing is saved', () => {
    renderNavBar()
    expect(screen.getByRole('link', { name: 'Saved projects' })).toBeInTheDocument()
  })

  it('shows a count badge reflecting the number of saved projects', () => {
    toggleSavedProject(PROJECT)
    renderNavBar()
    expect(screen.getByRole('link', { name: 'Saved projects (1)' })).toBeInTheDocument()
  })
})
