import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { isProjectSaved } from '../lib/savedProjects'
import type { ProjectCardOut } from '../lib/types'
import SaveButton from './SaveButton'

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

beforeEach(() => {
  localStorage.clear()
})

describe('SaveButton', () => {
  it('starts unsaved and saves the project on click', async () => {
    const user = userEvent.setup()
    render(<SaveButton project={PROJECT} />)

    const button = screen.getByRole('button', { name: /save this project/i })
    expect(button).toHaveAttribute('aria-pressed', 'false')

    await user.click(button)

    expect(screen.getByRole('button', { name: /remove from saved projects/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(isProjectSaved(PROJECT.id)).toBe(true)
  })

  it('unsaves an already-saved project on click', async () => {
    const user = userEvent.setup()
    render(<SaveButton project={PROJECT} />)

    await user.click(screen.getByRole('button', { name: /save this project/i }))
    await user.click(screen.getByRole('button', { name: /remove from saved projects/i }))

    expect(isProjectSaved(PROJECT.id)).toBe(false)
  })
})
