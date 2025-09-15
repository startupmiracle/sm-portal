/*
  Seed script for Startup Miracle Portal

  Usage:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... pnpm seed
    or: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed
*/
import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY envs for seeding')
  process.exit(1)
}

const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

async function main() {
  // Create org
  const orgSlug = 'cpf-floors'
  const orgName = 'CPF Floors'

  const { data: orgExisting } = await admin.from('organizations').select('*').eq('slug', orgSlug).maybeSingle()
  let orgId = orgExisting?.id as string | undefined
  if (!orgId) {
    // For seed, create a dummy owner
    const ownerId = crypto.randomUUID()
    const { data: org } = await admin
      .from('organizations')
      .insert({ slug: orgSlug, name: orgName, created_by: ownerId })
      .select('*')
      .single()
    orgId = org!.id
  }

  // Proposal: CPF Launchpad — 9-Week Sprint
  const proposalSlug = 'cpf-launchpad-9-week-sprint'
  const summary = `CPF Launchpad — 9-Week Sprint (Sep 22 → Nov 21)\n\nTwo payment dates: $4,800 on Wed Sep 17, $4,800 on Fri Oct 17; total $9,600.`
  const shareToken = Math.random().toString(36).slice(2)

  const { data: proposalExisting } = await admin
    .from('proposals')
    .select('*')
    .eq('org_id', orgId)
    .eq('slug', proposalSlug)
    .maybeSingle()
  let proposalId = proposalExisting?.id as string | undefined
  if (!proposalId) {
    const { data: p } = await admin
      .from('proposals')
      .insert({ org_id: orgId, slug: proposalSlug, title: 'CPF Launchpad — 9-Week Sprint', status: 'sent', summary_md: summary, share_token: shareToken })
      .select('*')
      .single()
    proposalId = p!.id
  }

  const sections: { title: string; body_md: string; sort: number }[] = [
    {
      title: 'Scope & Cadence',
      body_md:
        'Mondays 90-min exec; Thursdays 90-min group training; no 1:1, async course hub access (20 seats + 90 days).',
      sort: 1,
    },
    {
      title: 'Weekly Plan',
      body_md: 'Front-load 2 deliverables in Week 1, then 1/week.',
      sort: 2,
    },
    { title: 'W1 (Sep 22–26)', body_md: 'Paid Social optimization (Google + Meta) + Social Post #1 (Avatar video) targeting ~$20 CPL', sort: 3 },
    { title: 'W2', body_md: 'Telegram lead capture + 2-way SMS + Social Post #2', sort: 4 },
    { title: 'W3', body_md: 'Instagram Sniper + Installer campaign + Social Post #3', sort: 5 },
    { title: 'W4', body_md: 'Yelp scraping → pipeline + auto SMS + Social Post #4', sort: 6 },
    { title: 'W5', body_md: 'Lead enrichment in GHL (Retell) + Social Post #5', sort: 7 },
    { title: 'W6', body_md: 'Inventory check via SMS (“stock”) + Social Post #6', sort: 8 },
    { title: 'W7', body_md: 'New Twilio outbound line (cold/sniping) + Social Post #7', sort: 9 },
    { title: 'W8', body_md: 'AI agent “Roberta” (sales check-ins) + Social Post #8', sort: 10 },
    { title: 'W9 (Nov 17–21)', body_md: 'MBIC v1.0 final + Social Post #9', sort: 11 },
    { title: 'Social mix', body_md: '3 Avatar videos, 3 Carousels, 3 Static.', sort: 12 },
    { title: 'Acceptance & Dependencies', body_md: '2-day review window → auto-accept; Twilio A2P, ad access, brand assets, CRM/API keys.', sort: 13 },
    {
      title: 'Training License',
      body_md: 'Content (videos/PDFs/SOPs/quizzes) licensed for CPF internal use; IP retained by Startup Miracle.',
      sort: 14,
    },
    { title: 'CTAs', body_md: 'Buttons: “Approve & Start” (Stripe link: $4.8k/mo x2), “Book Exec Kickoff” (Cal.com).', sort: 15 },
  ]

  await admin.from('proposal_sections').upsert(
    sections.map((s) => ({ ...s, proposal_id: proposalId })),
    { onConflict: 'proposal_id,sort' }
  )

  const deliverables = [
    { title: 'Paid Social optimization', status: 'pending', sort: 1 },
    { title: 'Telegram lead capture', status: 'pending', sort: 2 },
  ]
  await admin
    .from('deliverables')
    .upsert(deliverables.map((d) => ({ ...d, proposal_id: proposalId })), { onConflict: 'proposal_id,sort' })

  // Course: Startup Miracle Academy → Funnels 101 → Speed-to-Lead & SMS Basics
  const { data: courseExisting } = await admin
    .from('courses')
    .select('*')
    .eq('org_id', orgId)
    .eq('slug', 'startup-miracle-academy')
    .maybeSingle()
  let courseId = courseExisting?.id as string | undefined
  if (!courseId) {
    const { data: c } = await admin
      .from('courses')
      .insert({ org_id: orgId, slug: 'startup-miracle-academy', title: 'Startup Miracle Academy', is_public: false })
      .select('*')
      .single()
    courseId = c!.id
  }

  const { data: moduleExisting } = await admin
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .eq('slug', 'funnels-101')
    .maybeSingle()
  let moduleId = moduleExisting?.id as string | undefined
  if (!moduleId) {
    const { data: m } = await admin
      .from('modules')
      .insert({ course_id: courseId, slug: 'funnels-101', title: 'Funnels 101', sort: 1 })
      .select('*')
      .single()
    moduleId = m!.id
  }

  const { data: lessonExisting } = await admin
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .eq('slug', 'speed-to-lead-sms-basics')
    .maybeSingle()
  let lessonId = lessonExisting?.id as string | undefined
  if (!lessonId) {
    const { data: l } = await admin
      .from('lessons')
      .insert({
        module_id: moduleId,
        slug: 'speed-to-lead-sms-basics',
        title: 'Speed-to-Lead & SMS Basics',
        video_url: '',
        pdf_url: '',
        body_md: 'Intro to speed-to-lead. Use SMS to follow up within minutes. Sample SOPs included.',
        sort: 1,
      })
      .select('*')
      .single()
    lessonId = l!.id
  }

  // Add sample quiz
  const questions = [
    {
      prompt: 'What is speed-to-lead?',
      options: ['Time to first contact', 'Page speed score', 'Lead velocity rate'],
      answer: 0,
    },
    {
      prompt: 'Best channel for immediate reply?',
      options: ['Email', 'SMS', 'Direct Mail'],
      answer: 1,
    },
    {
      prompt: 'Ideal follow-up window?',
      options: ['24 hours', '60 minutes', '5 minutes'],
      answer: 2,
    },
  ]
  for (const q of questions) {
    await admin.from('quiz_questions').insert({
      lesson_id: lessonId,
      prompt: q.prompt,
      options_json: q.options,
      answer_index: q.answer,
    })
  }

  console.log('Seed complete. Org slug:', orgSlug, 'Proposal share token:', shareToken)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

