import { GithubIcon, LinkedinIcon } from './icons'

const GITHUB_PROFILE_URL = 'https://github.com/Nelly444'
const LINKEDIN_URL = 'https://www.linkedin.com/in/nelson-supriyasilp/'

function Footer() {
  return (
    <footer className="border-t border-dove bg-fog px-24 py-32">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <p className="font-sohne text-caption leading-caption tracking-caption text-graphite">Empact</p>
        <div className="flex items-center gap-16">
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-graphite transition-colors hover:text-ink"
          >
            <GithubIcon />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-graphite transition-colors hover:text-ink"
          >
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
