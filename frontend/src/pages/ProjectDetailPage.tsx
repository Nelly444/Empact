import { ArrowLeft, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import FundingProgress from '../components/FundingProgress'
import OrgBadge from '../components/OrgBadge'
import { ApiError, api } from '../lib/api'
import type { ProjectDetailOut } from '../lib/types'

function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState<ProjectDetailOut | null>(null)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setProject(null)
    setNotFound(false)
    setError(null)
    api
      .get<ProjectDetailOut>(`/projects/${projectId}`)
      .then(setProject)
      .catch((err: unknown) => {
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true)
        } else if (err instanceof ApiError && err.status === 429) {
          setError("You're browsing a bit fast — wait a moment and try again.")
        } else {
          setError('Could not load this project — is the backend running?')
        }
      })
  }, [projectId])

  if (notFound) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-8 bg-fog px-24 text-center">
        <p className="font-sohne text-body text-ash">This project doesn't exist.</p>
        <Link to="/" className="font-sohne text-body text-ink underline">
          Back to search
        </Link>
      </main>
    )
  }

  if (error) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fog px-24 text-center">
        <p className="font-sohne text-body text-rust">{error}</p>
      </main>
    )
  }

  if (!project) {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fog">
        <Loader2 size={24} className="animate-spin text-graphite" />
      </main>
    )
  }

  const { organization, impact_estimate } = project

  return (
    <main className="min-h-[calc(100vh-64px)] bg-fog px-24 py-64">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-8 font-sohne text-caption text-graphite transition-colors hover:text-ink"
        >
          <ArrowLeft size={16} />
          Back to search
        </Link>

        <div className="mt-24 rounded-cards bg-pure-white p-24 shadow-subtle sm:p-32">
          <div className="flex items-start justify-between gap-16">
            <OrgBadge organization={organization} />
            {project.theme && (
              <span className="shrink-0 rounded-tags border border-dove px-12 py-4 font-sohne text-caption text-graphite">
                {project.theme}
              </span>
            )}
          </div>

          <h1 className="mt-16 font-signifier text-heading leading-heading tracking-heading text-ink">
            {project.title}
          </h1>

          {project.summary_cached && (
            <p className="mt-8 font-sohne text-body-lg leading-body-lg tracking-body-lg text-ash">
              {project.summary_cached}
            </p>
          )}

          <div className="mt-16">
            <FundingProgress fundingRaised={project.funding_raised} fundingGoal={project.funding_goal} />
          </div>

          {impact_estimate && (
            <div className="mt-16 rounded-inputs bg-apricot-wash p-16">
              <p className="font-sohne text-body text-ink">{impact_estimate.summary}</p>
              {impact_estimate.funding_velocity_per_day !== null && (
                <p className="mt-8 font-sohne text-caption leading-caption tracking-caption text-ink">
                  Raising about {Math.round(impact_estimate.funding_velocity_per_day).toLocaleString()} USD/day
                  {impact_estimate.days_to_fully_funded !== null &&
                    ` — about ${Math.ceil(impact_estimate.days_to_fully_funded)} days to fully funded`}
                </p>
              )}
            </div>
          )}

          {project.description_raw && (
            <div className="mt-32 border-t border-dove pt-24">
              <h2 className="font-sohne text-caption font-medium uppercase tracking-caption text-graphite">
                Full description
              </h2>
              <p className="mt-8 whitespace-pre-line font-sohne text-body leading-body tracking-body text-ash">
                {project.description_raw}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default ProjectDetailPage
