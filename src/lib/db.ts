import { supabase } from './supabase'
import type { User } from '@supabase/supabase-js'
import type {
  Organization,
  Profile,
  Membership,
  Proposal,
  ProposalSection,
  Deliverable,
  Course,
  Module,
  Lesson,
  Enrollment,
  QuizAttempt,
  QuizQuestion,
} from '@/types'

export async function ensureProfile(user: User) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  if (!existing) {
    await supabase.from('profiles').insert({
      id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name ?? null,
      avatar_url: user.user_metadata?.avatar_url ?? null,
    } as Partial<Profile>)
  }
}

export async function getMemberships(): Promise<Membership[]> {
  const { data, error } = await supabase.from('memberships').select('*')
  if (error) throw error
  return data as Membership[]
}

export async function getOrgBySlug(slug: string): Promise<Organization | null> {
  const { data } = await supabase.from('organizations').select('*').eq('slug', slug).maybeSingle()
  return (data as Organization) ?? null
}

export async function listProposalsByOrgSlug(slug: string): Promise<Proposal[]> {
  const org = await getOrgBySlug(slug)
  if (!org) return []
  const { data, error } = await supabase
    .from('proposals')
    .select('*')
    .eq('org_id', org.id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Proposal[]
}

export async function getProposalDetail(
  orgSlug: string,
  proposalSlug: string,
  opts?: { share?: string | null }
): Promise<{
  proposal: Proposal | null
  sections: ProposalSection[]
  deliverables: Deliverable[]
  source: 'share' | 'member' | 'none'
  shareInvalid?: boolean
}> {
  if (opts?.share) {
    // Public path via RPCs that validate share token
    const { data: proposals, error } = await supabase.rpc('get_proposal_public', {
      org_slug: orgSlug,
      proposal_slug: proposalSlug,
      share: opts.share,
    })
    if (error) throw error
    const proposal = (proposals?.[0] ?? null) as Proposal | null
    if (!proposal) {
      // Fall back to member path
      const member = await getProposalDetail(orgSlug, proposalSlug)
      if (member.proposal) return { ...member, shareInvalid: true }
      return { proposal: null, sections: [], deliverables: [], source: 'none', shareInvalid: true }
    }
    const [{ data: sections }, { data: deliverables }] = await Promise.all([
      supabase.rpc('get_proposal_sections_public', { org_slug: orgSlug, proposal_slug: proposalSlug, share: opts.share }),
      supabase.rpc('get_deliverables_public', { org_slug: orgSlug, proposal_slug: proposalSlug, share: opts.share }),
    ])
    return {
      proposal,
      sections: (sections ?? []) as ProposalSection[],
      deliverables: (deliverables ?? []) as Deliverable[],
      source: 'share',
    }
  } else {
    // Member path through RLS
    const org = await getOrgBySlug(orgSlug)
    if (!org) return { proposal: null, sections: [], deliverables: [], source: 'none' }
    const { data: proposal } = await supabase
      .from('proposals')
      .select('*')
      .eq('org_id', org.id)
      .eq('slug', proposalSlug)
      .maybeSingle()
    if (!proposal) return { proposal: null, sections: [], deliverables: [], source: 'none' }
    const [{ data: sections }, { data: deliverables }] = await Promise.all([
      supabase.from('proposal_sections').select('*').eq('proposal_id', (proposal as Proposal).id).order('sort'),
      supabase.from('deliverables').select('*').eq('proposal_id', (proposal as Proposal).id).order('sort'),
    ])
    return {
      proposal: proposal as Proposal,
      sections: (sections ?? []) as ProposalSection[],
      deliverables: (deliverables ?? []) as Deliverable[],
      source: 'member',
    }
  }
}

export async function listCoursesByOrgSlug(slug: string): Promise<Course[]> {
  const org = await getOrgBySlug(slug)
  if (!org) return []
  const { data, error } = await supabase.from('courses').select('*').eq('org_id', org.id)
  if (error) throw error
  return data as Course[]
}

export async function getCourseBySlug(orgSlug: string, courseSlug: string) {
  const org = await getOrgBySlug(orgSlug)
  if (!org) return null
  const { data } = await supabase
    .from('courses')
    .select('*')
    .eq('org_id', org.id)
    .eq('slug', courseSlug)
    .maybeSingle()
  return (data as Course) ?? null
}

export async function getModuleLessonPath(course_id: string) {
  const [{ data: modules }, { data: lessons }] = await Promise.all([
    supabase.from('modules').select('*').eq('course_id', course_id).order('sort'),
    supabase
      .from('lessons')
      .select('*, modules!inner(course_id, slug)')
      .order('sort'),
  ])
  return { modules: (modules ?? []) as Module[], lessons: (lessons ?? []) as Lesson[] }
}

export async function getLessonBySlugs(courseSlug: string, moduleSlug: string, lessonSlug: string) {
  const course = await getCourseBySlugFromAnyOrg(courseSlug)
  if (!course) return null
  const { data: mod } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', course.id)
    .eq('slug', moduleSlug)
    .maybeSingle()
  if (!mod) return null
  const { data: lesson } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', (mod as Module).id)
    .eq('slug', lessonSlug)
    .maybeSingle()
  return (lesson as Lesson) ?? null
}

async function getCourseBySlugFromAnyOrg(courseSlug: string) {
  const { data } = await supabase.from('courses').select('*').eq('slug', courseSlug).maybeSingle()
  return data as Course | null
}

export async function listQuizQuestions(lesson_id: string): Promise<QuizQuestion[]> {
  const { data } = await supabase.from('quiz_questions').select('*').eq('lesson_id', lesson_id)
  return (data ?? []) as QuizQuestion[]
}

export async function recordQuizAttempt(input: Omit<QuizAttempt, 'id' | 'created_at'>) {
  const { error } = await supabase.from('quiz_attempts').insert(input)
  if (error) throw error
}

export async function enroll(course_id: string, user_id: string) {
  const { error } = await supabase.from('enrollments').insert({ course_id, user_id, progress_json: {} })
  if (error) throw error
}

export async function listUserOrgs(): Promise<Organization[]> {
  // RLS grants select to members/owners
  const { data, error } = await supabase.from('organizations').select('id, slug, name, created_by')
  if (error) throw error
  return (data ?? []) as Organization[]
}
