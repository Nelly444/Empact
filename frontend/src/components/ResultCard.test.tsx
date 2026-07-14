import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { ProjectCardOut } from '../lib/types'
import ResultCard from './ResultCard'

const BASE_PROJECT: ProjectCardOut = {
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

function renderCard(project: ProjectCardOut) {
  render(
    <MemoryRouter>
      <ResultCard project={project} />
    </MemoryRouter>,
  )
}

describe('ResultCard', () => {
  it('renders no impact boxes when there is no impact estimate', () => {
    renderCard(BASE_PROJECT)
    expect(screen.queryByText(/donation would cover/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/USD\/day/i)).not.toBeInTheDocument()
  })

  it('renders only the marginal-dollar box when there is no velocity data yet', () => {
    renderCard({
      ...BASE_PROJECT,
      impact_estimate: {
        remaining_need: 30635.57,
        example_donation: 5,
        coverage_pct: 0.016,
        summary: "A $5 donation would cover ~0.0% of this project's remaining funding need.",
        funding_velocity_per_day: null,
        days_to_fully_funded: null,
      },
    })
    expect(screen.getByText(/donation would cover/i)).toBeInTheDocument()
    expect(screen.queryByText(/USD\/day/i)).not.toBeInTheDocument()
  })

  it('renders both the warm and cool impact boxes when velocity data exists', () => {
    renderCard({
      ...BASE_PROJECT,
      impact_estimate: {
        remaining_need: 30635.57,
        example_donation: 5,
        coverage_pct: 0.016,
        summary: "A $5 donation would cover ~0.0% of this project's remaining funding need.",
        funding_velocity_per_day: 2689.99,
        days_to_fully_funded: 11.39,
      },
    })
    expect(screen.getByText(/donation would cover/i)).toBeInTheDocument()
    expect(screen.getByText(/2,690 USD\/day/)).toBeInTheDocument()
    expect(screen.getByText(/12 days to fully funded/)).toBeInTheDocument()
  })
})
