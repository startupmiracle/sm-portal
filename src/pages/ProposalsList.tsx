import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { listProposalsByOrgSlug } from '@/lib/db'
import type { Proposal } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function ProposalsList() {
  const { org = '' } = useParams()
  const [items, setItems] = useState<Proposal[]>([])
  useEffect(() => {
    listProposalsByOrgSlug(org).then(setItems)
  }, [org])
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proposals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y">
          {items.map((p) => (
            <div key={p.id} className="flex items-center justify-between py-3">
              <div>
                <Link to={`/c/${org}/proposals/${p.slug}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <div className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleString()}</div>
              </div>
              <Badge variant={p.status === 'approved' ? 'success' : p.status === 'sent' ? 'secondary' : 'outline'}>
                {p.status}
              </Badge>
            </div>
          ))}
          {items.length === 0 && <div className="py-6 text-sm text-muted-foreground">No proposals yet.</div>}
        </div>
      </CardContent>
    </Card>
  )
}

