import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { enroll, getCourseBySlug, getModuleLessonPath } from '@/lib/db'
import type { Course, Module, Lesson } from '@/types'
import { supabase } from '@/lib/supabase'

export default function CourseOverview() {
  const { org = '', courseSlug = '' } = useParams()
  const [course, setCourse] = useState<Course | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const navigate = useNavigate()

  useEffect(() => {
    getCourseBySlug(org, courseSlug).then((c) => {
      setCourse(c)
      if (c) getModuleLessonPath(c.id).then(({ modules, lessons }) => { setModules(modules); setLessons(lessons) })
    })
  }, [org, courseSlug])

  async function onEnroll() {
    const { data } = await supabase.auth.getUser()
    const user = data.user
    if (!user || !course) return alert('Please sign in')
    await enroll(course.id, user.id)
    // Navigate to first lesson
    const firstModule = modules[0]
    const firstLesson = lessons.find((l) => l.module_id === firstModule?.id)
    if (firstModule && firstLesson) navigate(`/c/${org}/academy/${course.slug}/${firstModule.slug}/${firstLesson.slug}`)
  }

  if (!course) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">Course overview</div>
          <Button onClick={onEnroll}>Enroll</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-2 pl-6">
            {modules.map((m) => (
              <li key={m.id}>{m.title}</li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}

