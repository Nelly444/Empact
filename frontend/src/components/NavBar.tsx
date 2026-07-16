import { Link } from 'react-router-dom'
import { GithubIcon } from './icons'

const GITHUB_URL = 'https://github.com/Nelly444/Empact'

function NavBar() {
  return (
    <header className="sticky top-0 z-10 flex h-64 items-center justify-between border-b-2 border-rust bg-ink px-24">
      <Link
        to="/"
        className="font-sohne text-subheading font-medium tracking-subheading text-pure-white"
      >
        Empact
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
    </header>
  )
}

export default NavBar
