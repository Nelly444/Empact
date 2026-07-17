import { Link } from 'react-router-dom'
import ResultCard from '../components/ResultCard'
import { useSavedProjects } from '../lib/useSavedProjects'

function SavedProjectsPage() {
  const savedProjects = useSavedProjects()

  return (
    <main className="min-h-[calc(100vh-64px)] bg-fog px-24 py-64">
      <div className="mx-auto max-w-6xl">
        <h1 className="font-signifier text-heading-sm leading-heading-sm tracking-heading-sm text-ink">
          Saved projects
        </h1>

        {savedProjects.length === 0 ? (
          <p className="mt-16 font-sohne text-body text-ash">
            You haven't saved any projects yet. Tap the bookmark icon on a project to add it here — {' '}
            <Link to="/" className="text-ink underline">
              browse projects
            </Link>
            .
          </p>
        ) : (
          <div className="mt-24 grid grid-cols-1 gap-16 lg:grid-cols-2">
            {savedProjects.map((project, index) => (
              <ResultCard key={project.id} project={project} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default SavedProjectsPage
