import { GithubIcon, LinkedinIcon } from './icons'

const GITHUB_PROFILE_URL = 'https://github.com/Nelly444'
const LINKEDIN_URL = 'https://www.linkedin.com/in/nelson-supriyasilp/'

function Footer() {
  return (
    <footer className="border-t-2 border-teal bg-ink px-24 py-32">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <p className="font-sohne text-caption leading-caption tracking-caption text-dove">Empact</p>
        <div className="flex items-center gap-16">
          <a
            href={GITHUB_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="text-dove transition-all duration-150 hover:scale-110 hover:text-pure-white"
          >
            <GithubIcon />
          </a>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-dove transition-all duration-150 hover:scale-110 hover:text-pure-white"
          >
            <LinkedinIcon />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
