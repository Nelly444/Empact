import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center gap-8 bg-fog px-24 text-center">
      <p className="font-sohne text-body text-ash">Page not found.</p>
      <Link to="/" className="font-sohne text-body text-ink underline">
        Back to search
      </Link>
    </main>
  )
}

export default NotFoundPage
