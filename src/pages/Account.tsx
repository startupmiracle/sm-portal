import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Account() {
  const [email, setEmail] = useState<string>('')
  const [name, setName] = useState<string>('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? '')
      setName((data.user?.user_metadata as any)?.full_name ?? '')
    })
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        <div>
          <div className="text-xs text-muted-foreground">Email</div>
          <div>{email}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Name</div>
          <div>{name || '-'}</div>
        </div>
      </CardContent>
    </Card>
  )
}

