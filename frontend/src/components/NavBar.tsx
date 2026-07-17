import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSavedProjects } from '../lib/useSavedProjects'
import { GithubIcon } from './icons'

const GITHUB_URL = 'https://github.com/Nelly444/Empact'

function NavBar() {
  const savedCount = useSavedProjects().length

  return (
    <header className="sticky top-0 z-10 flex h-64 items-center justify-between border-b-2 border-rust bg-ink px-24">
      <Link
        to="/"
        className="font-sohne text-subheading font-medium tracking-subheading text-pure-white"
      >
        Empact
      </Link>
      <div className="flex items-center gap-20">
        <Link
          to="/saved"
          aria-label={`Saved projects${savedCount > 0 ? ` (${savedCount})` : ''}`}
          className="flex items-center gap-8 text-dove transition-all duration-150 hover:scale-110 hover:text-pure-white"
        >
          <Bookmark size={20} className={savedCount > 0 ? 'fill-current' : ''} />
          {savedCount > 0 && <span className="font-sohne text-caption">{savedCount}</span>}
        </Link>
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Empact on GitHub"
          className="text-dove transition-all duration-150 hover:scale-110 hover:text-pure-white"
        >
          <GithubIcon />
        </a>
      </div>
    </header>
  )
}

export default NavBar
