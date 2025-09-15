import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { listProposalsByOrgSlug, listCoursesByOrgSlug } from '@/lib/db'
import type { Proposal, Course } from '@/types'
import { Badge } from '@/components/ui/badge'

export default function OrgOverview() {
  const { org = '' } = useParams()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [courses, setCourses] = useState<Course[]>([])

  useEffect(() => {
    listProposalsByOrgSlug(org).then(setProposals)
    listCoursesByOrgSlug(org).then(setCourses)
  }, [org])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Proposals</CardTitle>
          <CardDescription>Latest proposals for your organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {proposals.map((p) => (
              <div key={p.id} className="flex items-center justify-between">
                <a href={`/c/${org}/proposals/${p.slug}`} className="font-medium hover:underline">
                  {p.title}
                </a>
                <Badge variant={p.status === 'approved' ? 'success' : p.status === 'sent' ? 'secondary' : 'outline'}>
                  {p.status}
                </Badge>
              </div>
            ))}
            {proposals.length === 0 && <div className="text-sm text-muted-foreground">No proposals yet.</div>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Academy</CardTitle>
          <CardDescription>Courses available to your team</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <a href={`/c/${org}/academy/${c.slug}`} className="font-medium hover:underline">
                  {c.title}
                </a>
                {c.is_public ? <Badge variant="secondary">Public</Badge> : null}
              </div>
            ))}
            {courses.length === 0 && <div className="text-sm text-muted-foreground">No courses yet.</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

