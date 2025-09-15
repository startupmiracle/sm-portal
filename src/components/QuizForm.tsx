import { useMemo, useState } from 'react'
import type { QuizQuestion } from '@/types'
import { Button } from './ui/button'

export default function QuizForm({
  questions,
  onSubmit,
}: {
  questions: QuizQuestion[]
  onSubmit: (answers: number[], score: number) => Promise<void> | void
}) {
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const score = useMemo(() => {
    let s = 0
    questions.forEach((q, i) => {
      if (answers[i] === q.answer_index) s++
    })
    return Math.round((s / Math.max(1, questions.length)) * 100)
  }, [answers, questions])

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault()
        await onSubmit(answers, score)
      }}
    >
      {questions.map((q, i) => {
        const options = JSON.parse(q.options_json) as string[]
        return (
          <div key={q.id} className="rounded-2xl border p-4">
            <div className="mb-3 font-medium">{i + 1}. {q.prompt}</div>
            <div className="space-y-2">
              {options.map((opt, oi) => (
                <label key={oi} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === oi}
                    onChange={() => setAnswers((a) => {
                      const na = [...a]
                      na[i] = oi
                      return na
                    })}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        )
      })}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Score: {score}%</div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  )
}

