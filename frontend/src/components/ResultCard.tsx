import { Link } from 'react-router-dom'
import { formatCurrency, formatPercent, initials } from '../lib/format'
import type { ProjectCardOut } from '../lib/types'

interface ResultCardProps {
  project: ProjectCardOut
}

function ResultCard({ project }: ResultCardProps) {
  const { organization, impact_estimate } = project
  const fundingPct =
    project.funding_goal && project.funding_goal > 0
      ? Math.min(((project.funding_raised ?? 0) / project.funding_goal) * 100, 100)
      : null

  const orgInfo = (
    <div className="flex items-center gap-12">
      {organization.logo_url ? (
        <img
          src={organization.logo_url}
          alt={organization.name}
          className="h-40 w-40 rounded-images object-cover"
        />
      ) : (
        <span className="flex h-40 w-40 shrink-0 items-center justify-center rounded-full bg-sky-wash font-sohne text-caption font-medium text-ink">
          {initials(organization.name)}
        </span>
      )}
      <div>
        <p className="font-sohne text-body font-medium text-ink">{organization.name}</p>
        {organization.address && (
          <p className="font-sohne text-caption leading-caption text-graphite">{organization.address}</p>
        )}
      </div>
    </div>
  )

  return (
    <div className="rounded-cards bg-pure-white p-24 shadow-subtle">
      <div className="flex items-start justify-between gap-16">
        {organization.homepage_url ? (
          <a href={organization.homepage_url} target="_blank" rel="noopener noreferrer">
            {orgInfo}
          </a>
        ) : (
          orgInfo
        )}

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

      {fundingPct !== null && (
        <div className="mt-16">
          <div className="h-8 w-full overflow-hidden rounded-tags bg-fog">
            <div className="h-full rounded-tags bg-rust" style={{ width: `${fundingPct}%` }} />
          </div>
          <p className="mt-4 font-sohne text-caption leading-caption text-graphite">
            {formatCurrency(project.funding_raised)} raised of {formatCurrency(project.funding_goal)} goal (
            {formatPercent(fundingPct)})
          </p>
        </div>
      )}

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
