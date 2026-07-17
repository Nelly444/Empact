import type { ProjectCardOut } from './types'

const STORAGE_KEY = 'empact:saved-projects'
const CHANGE_EVENT = 'empact:saved-projects-changed'

function readAll(): ProjectCardOut[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as ProjectCardOut[]) : []
  } catch {
    return []
  }
}

function writeAll(projects: ProjectCardOut[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
  // localStorage's own "storage" event only fires in *other* tabs, not this
  // one, so components in this tab (the save button, the nav badge, the
  // saved-projects list) need a same-tab signal to know something changed.
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function getSavedProjects(): ProjectCardOut[] {
  return readAll()
}

export function isProjectSaved(id: number): boolean {
  return readAll().some((p) => p.id === id)
}

export function toggleSavedProject(project: ProjectCardOut): void {
  const all = readAll()
  const alreadySaved = all.some((p) => p.id === project.id)
  writeAll(alreadySaved ? all.filter((p) => p.id !== project.id) : [...all, project])
}

export function subscribeSavedProjects(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}
