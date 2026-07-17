import { useEffect, useState } from 'react'
import { getSavedProjects, subscribeSavedProjects } from './savedProjects'
import type { ProjectCardOut } from './types'

export function useSavedProjects(): ProjectCardOut[] {
  const [saved, setSaved] = useState<ProjectCardOut[]>(() => getSavedProjects())

  useEffect(() => subscribeSavedProjects(() => setSaved(getSavedProjects())), [])

  return saved
}
