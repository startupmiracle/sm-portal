import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-50 via-white to-fuchsia-50" />
      {/* Overlays */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 h-80 w-80 rounded-full bg-fuchsia-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-300/20 blur-3xl" />

      <main className="container mx-auto flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
          Coming soon
        </div>

        <img
          src="https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png"
          alt="Startup Miracle"
          className="mb-4 h-12 w-12"
        />

        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          GAaaS Customer Portal + Online Academy
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-balance text-slate-600">
          One hub for proposals, deliverables, meetings, and the learning community.
        </p>

        <div className="mt-8">
          <img
            src="https://res.cloudinary.com/dy7cv4bih/image/upload/v1756342114/SM-GAaaS_Card_yn0php.png"
            alt="Startup Miracle GAaaS"
            className="mx-auto w-full max-w-md rounded-2xl border shadow-soft"
            loading="lazy"
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Link className="rounded-xl border bg-white/70 px-4 py-3 shadow-soft backdrop-blur hover:bg-white" to="/c/cpf-floors/overview">
            Org Overview
          </Link>
          <Link className="rounded-xl border bg-white/70 px-4 py-3 shadow-soft backdrop-blur hover:bg-white" to="/c/cpf-floors/proposals">
            Proposals
          </Link>
          <Link className="rounded-xl border bg-white/70 px-4 py-3 shadow-soft backdrop-blur hover:bg-white" to="/c/cpf-floors/academy">
            Academy
          </Link>
        </div>

        <div className="mt-6 text-sm text-muted-foreground">
          Want early access? <Link className="text-primary underline-offset-4 hover:underline" to="/account">Sign in</Link>
        </div>
      </main>

      <footer className="border-t bg-white/70 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 text-sm text-muted-foreground">
          <div>© {new Date().getFullYear()} Startup Miracle</div>
          <div className="flex gap-4">
            <a href="https://startupmiracle.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Website</a>
            <a href="https://github.com/startupmiracle/sm-portal" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
