import { Link } from 'react-router-dom'
import { formatPercent } from '../lib/format'
import type { ProjectCardOut } from '../lib/types'
import FundingProgress from './FundingProgress'
import OrgBadge from './OrgBadge'

interface ResultCardProps {
  project: ProjectCardOut
}

function ResultCard({ project }: ResultCardProps) {
  const { organization, impact_estimate } = project

  return (
    <div className="rounded-cards bg-pure-white p-24 shadow-subtle">
      <div className="flex items-start justify-between gap-16">
        <OrgBadge organization={organization} />

        {project.theme && (
          <span className="shrink-0 rounded-tags border border-dove px-12 py-4 font-sohne text-caption text-graphite">
            {project.theme}
          </span>
        )}
      </div>

      <Link to={`/projects/${project.id}`} className="mt-16 block">
        <h3 className="font-signifier text-heading-sm leading-heading-sm tracking-heading-sm text-ink hover:underline">
          {project.title}
        </h3>
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
        <div className="mt-16 rounded-inputs bg-apricot-wash p-16">
          <p className="font-sohne text-caption leading-caption tracking-caption text-ink">
            {impact_estimate.summary}
          </p>
        </div>
      )}

      {project.similarity !== null && (
        <p className="mt-8 font-sohne text-caption text-graphite">
          {formatPercent(project.similarity * 100)} match
        </p>
      )}
    </div>
  )
}

export default ResultCard
