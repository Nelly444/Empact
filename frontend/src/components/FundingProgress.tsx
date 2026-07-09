import { formatCurrency, formatPercent } from '../lib/format'

interface FundingProgressProps {
  fundingRaised: number | null
  fundingGoal: number | null
}

function FundingProgress({ fundingRaised, fundingGoal }: FundingProgressProps) {
  if (!fundingGoal || fundingGoal <= 0) return null
  const pct = Math.min(((fundingRaised ?? 0) / fundingGoal) * 100, 100)

  return (
    <div>
      <div className="h-8 w-full overflow-hidden rounded-tags bg-fog">
        <div className="h-full rounded-tags bg-rust" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-4 font-sohne text-caption leading-caption text-graphite">
        {formatCurrency(fundingRaised)} raised of {formatCurrency(fundingGoal)} goal ({formatPercent(pct)})
      </p>
    </div>
  )
}

export default FundingProgress
