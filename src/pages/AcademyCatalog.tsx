import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { listCoursesByOrgSlug } from '@/lib/db'
import type { Course } from '@/types'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AcademyCatalog() {
  const { org = '' } = useParams()
  const [courses, setCourses] = useState<Course[]>([])
  useEffect(() => {
    listCoursesByOrgSlug(org).then(setCourses)
  }, [org])
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c) => (
        <Card key={c.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{c.title}</CardTitle>
            <CardDescription>{c.is_public ? 'Public course' : 'Private course'}</CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            <Link className="text-primary hover:underline" to={`/c/${org}/academy/${c.slug}`}>
              View course
            </Link>
          </CardContent>
        </Card>
      ))}
      {courses.length === 0 && <div className="text-sm text-muted-foreground">No courses yet.</div>}
    </div>
  )
}

