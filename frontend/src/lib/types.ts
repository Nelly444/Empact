export interface OrganizationOut {
  id: number
  globalgiving_id: string
  name: string
  home_country: string | null
  countries_served: string | null
  address: string | null
  logo_url: string | null
  homepage_url: string | null
}

export interface ImpactEstimateOut {
  remaining_need: number
  example_donation: number
  coverage_pct: number
  summary: string
  funding_velocity_per_day: number | null
  days_to_fully_funded: number | null
}

export interface ProjectCardOut {
  id: number
  title: string
  theme: string | null
  organization: OrganizationOut
  summary_cached: string | null
  funding_goal: number | null
  funding_raised: number | null
  project_url: string | null
  impact_estimate: ImpactEstimateOut | null
  similarity: number | null
}

export interface ProjectDetailOut extends ProjectCardOut {
  description_raw: string | null
}

export interface FilterOptions {
  org_names: string[]
  home_countries: string[]
  themes: string[]
  countries_served: string[]
}

export interface SearchFilters {
  query?: string
  org_name?: string
  home_country?: string
  countries_served?: string
  themes?: string[]
  limit?: number
}
