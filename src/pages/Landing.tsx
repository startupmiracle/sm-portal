import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } })
    setLoading(false)
    if (!error) setSent(true)
    else alert(error.message)
  }

  return (
    <div className="mx-auto grid max-w-2xl gap-6">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold">Startup Miracle Portal</h1>
        <p className="text-muted-foreground">GAaaS customer portal and online academy</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="text-sm text-emerald-700">Magic link sent. Check your email.</div>
          ) : (
            <div className="flex gap-2">
              <input
                type="email"
                className="flex-1 rounded-xl border px-3"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button onClick={login} disabled={!email || loading}>Send Link</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

