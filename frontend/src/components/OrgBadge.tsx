import { initials, safeHttpUrl } from '../lib/format'
import type { OrganizationOut } from '../lib/types'

interface OrgBadgeProps {
  organization: OrganizationOut
}

function OrgBadge({ organization }: OrgBadgeProps) {
  const homepageUrl = safeHttpUrl(organization.homepage_url)
  const logoUrl = safeHttpUrl(organization.logo_url)

  const content = (
    <div className="flex items-center gap-12">
      {logoUrl ? (
        <img src={logoUrl} alt={organization.name} className="h-40 w-40 rounded-images object-cover" />
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

  return homepageUrl ? (
    <a href={homepageUrl} target="_blank" rel="noopener noreferrer">
      {content}
    </a>
  ) : (
    content
  )
}

export default OrgBadge
