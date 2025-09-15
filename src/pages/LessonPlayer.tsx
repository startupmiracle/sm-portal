import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Markdown from '@/components/Markdown'
import VideoPlayer from '@/components/VideoPlayer'
import PDFViewer from '@/components/PDFViewer'
import QuizForm from '@/components/QuizForm'
import { getCourseBySlug, getLessonBySlugs, listQuizQuestions, recordQuizAttempt } from '@/lib/db'
import type { Lesson, QuizQuestion } from '@/types'
import { supabase } from '@/lib/supabase'

export default function LessonPlayer() {
  const { org = '', courseSlug = '', moduleSlug = '', lessonSlug = '' } = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])

  useEffect(() => {
    getLessonBySlugs(courseSlug, moduleSlug, lessonSlug).then(setLesson)
  }, [courseSlug, moduleSlug, lessonSlug])

  useEffect(() => {
    if (lesson) listQuizQuestions(lesson.id).then(setQuiz)
  }, [lesson])

  if (!lesson) return <div className="text-sm text-muted-foreground">Loading...</div>

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{lesson.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <VideoPlayer src={lesson.video_url ?? undefined} />
          <PDFViewer src={lesson.pdf_url ?? undefined} />
          <Markdown>{lesson.body_md}</Markdown>
        </CardContent>
      </Card>

      {quiz.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <QuizForm
              questions={quiz}
              onSubmit={async (answers, score) => {
                const { data } = await supabase.auth.getUser()
                const user = data.user
                if (!user) return alert('Please sign in')
                await recordQuizAttempt({
                  user_id: user.id,
                  lesson_id: lesson.id,
                  answers_json: JSON.stringify(answers),
                  score,
                } as any)
                alert(`Score: ${score}%`)
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

