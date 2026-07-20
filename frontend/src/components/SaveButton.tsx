import { Bookmark } from 'lucide-react'
import { useState } from 'react'
import { isProjectSaved, toggleSavedProject } from '../lib/savedProjects'
import type { ProjectCardOut } from '../lib/types'

interface SaveButtonProps {
  project: ProjectCardOut
}

function SaveButton({ project }: SaveButtonProps) {
  const [isSaved, setIsSaved] = useState(() => isProjectSaved(project.id))

  function handleClick(event: React.MouseEvent) {
    event.preventDefault()
    event.stopPropagation()
    toggleSavedProject(project)
    setIsSaved((prev) => !prev)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={isSaved}
      aria-label={isSaved ? 'Remove from saved projects' : 'Save this project'}
      className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-fog"
    >
      <Bookmark size={18} className={isSaved ? 'fill-rust text-rust' : 'text-graphite'} />
    </button>
  )
}

export default SaveButton
