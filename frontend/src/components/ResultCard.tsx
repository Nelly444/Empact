import { ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPercent, safeHttpUrl } from '../lib/format'
import type { ProjectCardOut } from '../lib/types'
import FundingProgress from './FundingProgress'
import OrgBadge from './OrgBadge'
import SaveButton from './SaveButton'
import ThemeTag from './ThemeTag'

interface ResultCardProps {
  project: ProjectCardOut
  index?: number
}

function ResultCard({ project, index = 0 }: ResultCardProps) {
  const { organization, impact_estimate } = project
  const donateUrl = safeHttpUrl(project.project_url)

  return (
    <div
      className="animate-card-in rounded-cards bg-pure-white p-24 shadow-subtle transition-[transform,box-shadow] duration-200 hover:-translate-y-2 hover:shadow-lifted"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="flex items-start justify-between gap-16">
        <OrgBadge organization={organization} />

        <div className="flex shrink-0 items-center gap-8">
          {project.theme && <ThemeTag theme={project.theme} />}
          <SaveButton project={project} />
        </div>
      </div>

      <Link to={`/projects/${project.id}`} className="mt-16 block">
        <h2 className="font-sohne text-heading-sm font-medium leading-heading-sm tracking-heading-sm text-ink hover:underline">
          {project.title}
        </h2>
      </Link>

      {project.summary_cached && (
        <p className="mt-8 font-sohne text-body leading-body tracking-body text-ash">
          {project.summary_cached}
        </p>
      )}

      <div className="mt-16">
        <FundingProgress fundingRaised={project.funding_raised} fundingGoal={project.funding_goal} />
      </div>

      {impact_estimate && (
        <div className="mt-16">
          <div className="rounded-inputs bg-apricot-wash p-16">
            <p className="font-sohne text-caption leading-caption tracking-caption text-ink">
              {impact_estimate.summary}
            </p>
          </div>
          {impact_estimate.funding_velocity_per_day !== null && (
            <div className="mt-8 rounded-inputs bg-sky-wash p-16">
              <p className="font-sohne text-caption leading-caption tracking-caption text-ink">
                Raising about {Math.round(impact_estimate.funding_velocity_per_day).toLocaleString()} USD/day
                {impact_estimate.days_to_fully_funded !== null &&
                  ` — about ${Math.ceil(impact_estimate.days_to_fully_funded)} days to fully funded`}
              </p>
            </div>
          )}
        </div>
      )}

      {project.similarity !== null && (
        <p className="mt-8 font-sohne text-caption text-graphite">
          {formatPercent(project.similarity * 100)} match
        </p>
      )}

      {donateUrl && (
        <a
          href={donateUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-16 flex items-center justify-center gap-8 rounded-buttons bg-rust px-20 py-8 font-sohne text-body font-medium text-pure-white transition-transform duration-150 hover:scale-[1.02] active:scale-95"
        >
          Donate on GlobalGiving
          <ExternalLink size={16} />
        </a>
      )}
    </div>
  )
}

export default ResultCard
