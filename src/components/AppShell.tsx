import { Outlet, Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Button } from './ui/button'
import { Card } from './ui/card'
import { supabase } from '@/lib/supabase'
import { getMemberships, listUserOrgs } from '@/lib/db'
import type { Organization } from '@/types'

export default function AppShell() {
  const navigate = useNavigate()
  const { org } = useParams()
  const { pathname } = useLocation()
  const [authed, setAuthed] = useState(false)
  const [memberships, setMemberships] = useState<{ org_id: string; role: string }[]>([])
  const [orgs, setOrgs] = useState<Organization[]>([])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (authed) {
      getMemberships().then((ms) => setMemberships(ms))
      listUserOrgs().then(setOrgs)
    } else {
      setMemberships([])
      setOrgs([])
    }
  }, [authed])

  const currentOrgSlug = org ?? orgs[0]?.slug

  const routes = useMemo(() => {
    if (!currentOrgSlug) return [] as { to: string; label: string }[]
    return [
      { to: `/c/${currentOrgSlug}/overview`, label: 'Overview' },
      { to: `/c/${currentOrgSlug}/proposals`, label: 'Proposals' },
      { to: `/c/${currentOrgSlug}/academy`, label: 'Academy' },
    ]
  }, [currentOrgSlug])

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col gap-2 border-r p-4 md:flex">
        <div className="mb-4 text-lg font-semibold">Startup Miracle</div>
        {authed ? (
          <>
            <OrgSwitcher orgs={orgs} currentOrgSlug={currentOrgSlug} />
            <nav className="mt-4 grid gap-1">
              {routes.map((r) => (
                <Link key={r.to} to={r.to} className="rounded-xl px-3 py-2 hover:bg-secondary">
                  {r.label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto">
              <Button
                className="w-full"
                variant="outline"
                onClick={async () => {
                  await supabase.auth.signOut()
                  navigate('/')
                }}
              >
                Sign out
              </Button>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">Sign in to access org content</div>
        )}
      </aside>
      <main className="flex-1">
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png"
                alt="Startup Miracle"
                className="h-8 w-8"
              />
              <span className="font-semibold">Startup Miracle</span>
            </Link>
            <div className="flex items-center gap-2">
              <Link to="/account" className="rounded-xl px-3 py-1.5 hover:bg-secondary">Account</Link>
            </div>
          </div>
        </header>
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

function OrgSwitcher({ orgs, currentOrgSlug }: { orgs: Organization[]; currentOrgSlug?: string }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const basePath = pathname.split('/').slice(0, 4).join('/')
  return (
    <Card className="p-3">
      <div className="mb-2 text-sm font-medium">Organization</div>
      <select
        className="w-full rounded-xl border bg-background px-3 py-2"
        value={currentOrgSlug}
        onChange={(e) => {
          const newOrg = e.target.value
          if (!newOrg) return
          const parts = pathname.split('/')
          if (parts[1] === 'c' && parts.length >= 3) {
            parts[2] = newOrg
            navigate(parts.join('/'))
          } else {
            navigate(`/c/${newOrg}/overview`)
          }
        }}
      >
        {orgs.map((o) => (
          <option key={o.id} value={o.slug}>
            {o.name} ({o.slug})
          </option>
        ))}
      </select>
    </Card>
  )
}
