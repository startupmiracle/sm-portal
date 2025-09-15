export type UUID = string

export type Role = 'owner' | 'client_admin' | 'learner'

export interface Organization {
  id: UUID
  slug: string
  name: string
  created_by: UUID
}

export interface Profile {
  id: UUID
  email: string
  full_name: string | null
  avatar_url: string | null
}

export interface Membership {
  id: UUID
  org_id: UUID
  user_id: UUID
  role: Role
}

export interface Proposal {
  id: UUID
  org_id: UUID
  slug: string
  title: string
  status: 'draft' | 'sent' | 'approved' | 'declined'
  share_token: string | null
  summary_md: string | null
  created_at: string
}

export interface ProposalSection {
  id: UUID
  proposal_id: UUID
  title: string
  body_md: string
  sort: number
}

export interface Deliverable {
  id: UUID
  proposal_id: UUID
  title: string
  status: 'pending' | 'in_progress' | 'done'
  due_date: string | null
  sort: number
}

export interface Course {
  id: UUID
  org_id: UUID
  slug: string
  title: string
  summary_md: string | null
  is_public: boolean
}

export interface Module {
  id: UUID
  course_id: UUID
  slug: string
  title: string
  sort: number
}

export interface Lesson {
  id: UUID
  module_id: UUID
  slug: string
  title: string
  video_url: string | null
  pdf_url: string | null
  body_md: string | null
  sort: number
}

export interface Enrollment {
  id: UUID
  user_id: UUID
  course_id: UUID
  progress_json: unknown
}

export interface QuizQuestion {
  id: UUID
  lesson_id: UUID
  prompt: string
  options_json: string // JSON string array
  answer_index: number
}

export interface QuizAttempt {
  id: UUID
  lesson_id: UUID
  user_id: UUID
  answers_json: string // JSON string array of indices
  score: number
  created_at: string
}

