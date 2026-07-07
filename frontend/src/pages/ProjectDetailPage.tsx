import { useParams } from 'react-router-dom'

function ProjectDetailPage() {
  const { projectId } = useParams()

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-fog">
      <div className="rounded-cards bg-pure-white p-12 shadow-subtle">
        <h1 className="font-signifier text-heading-sm leading-heading-sm tracking-heading-sm text-ink">
          Project #{projectId}
        </h1>
        <p className="mt-4 font-sohne text-body leading-body tracking-body text-ash">
          Project detail scaffold — full project view comes later.
        </p>
      </div>
    </main>
  )
}

export default ProjectDetailPage
