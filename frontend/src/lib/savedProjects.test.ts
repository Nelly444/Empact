import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getSavedProjects,
  isProjectSaved,
  subscribeSavedProjects,
  toggleSavedProject,
} from './savedProjects'
import type { ProjectCardOut } from './types'

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

describe('savedProjects', () => {
  it('starts empty', () => {
    expect(getSavedProjects()).toEqual([])
    expect(isProjectSaved(PROJECT.id)).toBe(false)
  })

  it('adds a project on toggle, and removes it on a second toggle', () => {
    toggleSavedProject(PROJECT)
    expect(isProjectSaved(PROJECT.id)).toBe(true)
    expect(getSavedProjects()).toEqual([PROJECT])

    toggleSavedProject(PROJECT)
    expect(isProjectSaved(PROJECT.id)).toBe(false)
    expect(getSavedProjects()).toEqual([])
  })

  it('persists across reads (backed by localStorage, not in-memory state)', () => {
    toggleSavedProject(PROJECT)
    expect(getSavedProjects()).toHaveLength(1)
    expect(getSavedProjects()).toHaveLength(1)
  })

  it('notifies subscribers when a project is toggled', () => {
    const callback = vi.fn()
    const unsubscribe = subscribeSavedProjects(callback)

    toggleSavedProject(PROJECT)
    expect(callback).toHaveBeenCalledTimes(1)

    unsubscribe()
    toggleSavedProject(PROJECT)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
