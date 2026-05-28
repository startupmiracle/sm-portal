// Skill template generators for the Workshop Portal.
// Each generator returns a SKILL.md compatible with Claude Code skills
// (https://docs.claude.com/en/docs/claude-code/skills) and equally usable
// as pasteable instructions in Claude.ai / Cowork projects.

export type WorkshopLead = {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    company_name: string | null;
    job_title: string | null;
    role: string | null;
    company_size: string | null;
    company_industry: string | null;
    business_task: string | null;
    ai_dream: string | null;
    ai_stage: string | null;
    enriched_data: Record<string, unknown> | null;
    recommendations: Record<string, unknown> | null;
    discovery_answers: Record<string, DiscoveryValue> | null;
};

export type DiscoveryValue = "yes" | "no" | "unsure";

export type SkillSlug =
    | "more-sales"
    | "publish-content"
    | "qualify-leads"
    | "quote-faster"
    | "answer-faster"
    | "30-60-90-plan"
    | "linear-tracker";

export type SkillMeta = {
    slug: SkillSlug;
    title: string;
    pain: string;
    description: string;
    icon: string;
    color: string;
};

export const SKILL_CATALOG: SkillMeta[] = [
    {
        slug: "more-sales",
        title: "I want more sales",
        pain: "Inbound is unpredictable, outbound is ad-hoc, no clear pipeline.",
        description:
            "Build a Claude-powered outbound + inbound motion: research ideal customers, draft personalized first-touch, follow up at the right cadence, log everything to the CRM.",
        icon: "TrendingUp",
        color: "emerald",
    },
    {
        slug: "publish-content",
        title: "I'd love to publish content easily",
        pain: "Blog stalled, social inconsistent, SEO + GEO leaving money on the table.",
        description:
            "Turn a 5-min voice memo into a publishable blog post (SEO + AEO ready) + a LinkedIn carousel + 3 X posts + an Instagram caption. Image briefs included.",
        icon: "PenTool",
        color: "violet",
    },
    {
        slug: "qualify-leads",
        title: "I want to stop answering the phone",
        pain: "Phone is constant, most calls aren't qualified, you can't focus.",
        description:
            "Stand up an AI receptionist (Vapi or similar) that qualifies, books a meeting on the calendar, and only escalates to you when the lead is sales-ready.",
        icon: "PhoneOff",
        color: "amber",
    },
    {
        slug: "quote-faster",
        title: "I want to quote faster",
        pain: "Quotes take days because the intake → pricing → doc loop is manual.",
        description:
            "A Claude skill that takes a structured intake and produces a branded PDF quote in under 5 minutes — pricing, scope, timeline, terms, and a Stripe checkout link.",
        icon: "FileText",
        color: "blue",
    },
    {
        slug: "answer-faster",
        title: "I want to answer customers faster",
        pain: "Inbox is a graveyard. Slow first response = lost deals.",
        description:
            "An AI triage that reads every inbound email, drafts a response in your voice, files it under the right contact, and surfaces only the threads that actually need you.",
        icon: "MessageSquare",
        color: "rose",
    },
    {
        slug: "30-60-90-plan",
        title: "Generate my 30/60/90 day plan",
        pain: "Lots of ideas, no execution sequence, no quick-wins identified.",
        description:
            "Master skill: takes everything you told us + your discovery answers and produces a 30/60/90 day execution plan with high-ROI quick wins for the first 14 days.",
        icon: "Target",
        color: "fuchsia",
    },
    {
        slug: "linear-tracker",
        title: "Spin up my Linear project tracker",
        pain: "Plans live in Google Docs. Nothing ships. No accountability.",
        description:
            "A skill that, when run inside Claude with your Linear MCP connected, creates the workspace, the project, the epics, and the first sprint of tickets from your 30/60/90 plan.",
        icon: "Trello",
        color: "indigo",
    },
];

export const DISCOVERY_QUESTIONS: { key: string; label: string; description: string }[] = [
    {
        key: "website",
        label: "1. Do you have a website?",
        description: "A real one — fast, mobile, clear offer above the fold.",
    },
    {
        key: "opt_in_form",
        label: "2. Is there a frictionless opt-in form on your website?",
        description: "3 fields max, no friction, capturing TCPA-compliant consent.",
    },
    {
        key: "blog",
        label: "3. Are you publishing content Google + ChatGPT can read?",
        description: "Blog with proper schema, AEO-optimized, indexed weekly.",
    },
    {
        key: "crm",
        label: "4. Do you have a CRM (Customer Relationship Management)?",
        description: "A system where all your leads, customers, and conversations are tracked in one place.",
    },
    {
        key: "crm_fast_response",
        label: "5. Does your CRM allow you to respond to leads fast?",
        description: "Speed to first reply under 5 minutes. Instant notifications when a new lead comes in.",
    },
    {
        key: "crm_followup",
        label: "6. Do you have a follow-up system for leads and existing customers?",
        description: "Automated sequences, reminders, and cadences so no lead falls through the cracks.",
    },
    {
        key: "offer_clarity",
        label: "7. Is your offer crystal clear?",
        description: "A 10-year-old should understand what you sell and the outcome in 10 seconds.",
    },
    {
        key: "pricing_alignment",
        label: "8. Is your pricing aligned to your target customer?",
        description: "Not too low (cheap signals), not too high (locks you out), tiers if needed.",
    },
    {
        key: "backend_offer",
        label: "9. Do you have a backend offer to upsell + retain?",
        description: "Once they buy the first thing, what keeps them paying you next month?",
    },
    {
        key: "referral_system",
        label: "10. Can customers easily refer you?",
        description: "A shareable link, an incentive, a moment in the journey where you ask.",
    },
];

const TECH_STACK_REFERENCE = `## Recommended tech stack (proven by Startup Miracle)

| Layer | Tool | Why |
|---|---|---|
| AI master brain | Claude (Opus / Sonnet) + OpenAI as backup | Best reasoning, best skills system |
| Virtual assistant | Hermes | Human-in-the-loop for things AI shouldn't touch yet |
| Project management | Linear (or GitHub Projects) | Humans + AI agents share context, long-term memory |
| Website | Next.js on Vercel + Cloudflare (DNS + bot protection) | Fast, secure, easy AI integration |
| Database / CRM | Supabase (preferred) or HubSpot | Supabase = freedom to scale AI capabilities |
| Email ops | Resend (transactional) + Gmail (human) | Deliverability + reply continuity |
| Payments | Stripe | Payment links, subscriptions, webhooks |
| Meetings + context | Granola | Auto-transcribed meetings feed Claude's long-term memory |
| Marketing analytics | Google Analytics + Meta Business Manager | Attribution + retargeting |
| Secrets / passwords | Bitwarden | Central hub for humans AND AI agents |
`;

function joinList(items: string[]): string {
    return items.filter(Boolean).map((s) => `- ${s}`).join("\n");
}

function formatDiscovery(lead: WorkshopLead): string {
    const answers = lead.discovery_answers || {};
    return DISCOVERY_QUESTIONS.map((q) => {
        const v = answers[q.key];
        const mark = v === "yes" ? "✅" : v === "no" ? "❌" : "❓";
        return `- ${mark} **${q.label}** — ${v ? v.toUpperCase() : "not answered yet"}`;
    }).join("\n");
}

function leadContext(lead: WorkshopLead): string {
    const lines = [
        lead.first_name && lead.last_name && `**Name:** ${lead.first_name} ${lead.last_name}`,
        lead.job_title && `**Title:** ${lead.job_title}`,
        lead.company_name && `**Company:** ${lead.company_name}`,
        lead.company_industry && `**Industry:** ${lead.company_industry}`,
        lead.company_size && `**Team size:** ${lead.company_size}`,
        lead.ai_stage && `**Current AI stage:** ${lead.ai_stage}`,
        lead.business_task && `**Top reporting / business pain to automate:**\n> ${lead.business_task}`,
        lead.ai_dream && `**Where they want AI to take them in 12 months:**\n> ${lead.ai_dream}`,
    ].filter(Boolean) as string[];
    return lines.join("\n\n");
}

function buildHeader(slug: SkillSlug, description: string): string {
    return `---
name: ${slug}
description: ${description}
---`;
}

function buildFooter(lead: WorkshopLead): string {
    return `
---

## Reference — your Startup Miracle workshop snapshot

${leadContext(lead)}

### Your discovery answers
${formatDiscovery(lead)}

${TECH_STACK_REFERENCE}

> Built for ${lead.first_name || "you"} at the Claude SMB Workshop · ${new Date().toISOString().slice(0, 10)}
> Questions: javier@startupmiracle.com
`;
}

/* ───────────────────────── Skill bodies ───────────────────────── */

function bodyMoreSales(lead: WorkshopLead): string {
    const industry = lead.company_industry || "your industry";
    return `# Skill: More Sales — for ${lead.company_name || "your business"}

You are a senior revenue operator helping a ${industry} business owner build a
predictable sales motion. The owner described their pain as:

> ${lead.business_task || "ad-hoc sales, no system"}

And their 12-month dream as:

> ${lead.ai_dream || "AI handling the work that doesn't need me"}

## When to use this skill

Use this skill whenever the user says any of:
- "help me get more leads"
- "I need to follow up with X"
- "write me a cold email / cold DM"
- "what should my outreach look like"
- "build me a sales sequence"
- "score this lead"

## What to do — execute in this order

### 1. Define the Ideal Customer (ICP)
Ask 3 questions if not already answered:
1. Who is the most profitable customer you've ever had?
2. What did their company look like (size, industry, geography)?
3. What was the trigger event that made them buy?

Then write a 1-paragraph ICP statement and 3 firmographic filters
(industry NAICS code, employee count range, geography) the user can plug into
Apollo / LinkedIn Sales Navigator / Google Maps.

### 2. Build the first-touch script
Produce TWO versions:
- **Cold email** — 50 words max, problem-first, no pitch, 1 question CTA.
- **Voice/Vapi script** — 30-second opener for an AI receptionist using the
  Startup Miracle Speed to Lead playbook.

### 3. Build the follow-up cadence
Default cadence (override if the user pushes back):
- Day 0: First touch
- Day 2: Bump (same thread, "in case this got buried")
- Day 5: Different angle (case study or proof point)
- Day 9: Breakup ("closing the loop")
- Day 21: Newsletter / nurture sequence

### 4. CRM logging
The user's CRM is **${(lead.enriched_data as Record<string, unknown>)?.crm || "Supabase / HubSpot — confirm which"}**.
For each prospect, structure data like this:
\`\`\`json
{
  "email": "",
  "company": "",
  "icp_score": 0,
  "stage": "new | contacted | replied | meeting | proposal | closed_won | closed_lost",
  "last_touch_at": "",
  "next_action": "",
  "next_action_at": ""
}
\`\`\`

### 5. Quick win for week 1
Pick ONE channel — email or phone. Not both. Get 10 first-touches out.
Measure: reply rate (target 8%+) and booked meeting rate (target 1.5%+).

## Output format
Always end with a numbered action list the user can do in the next 60 minutes.
Never recommend more than 3 actions at once.
`;
}

function bodyPublishContent(lead: WorkshopLead): string {
    return `# Skill: Publish Content Easily — for ${lead.company_name || "your business"}

You help ${lead.first_name || "the user"} turn raw thinking into publishable
content across blog, LinkedIn, X, and Instagram. Their industry is
**${lead.company_industry || "their industry"}** and their voice should sound like
a practitioner, not a marketer.

## When to use
- "write a blog post about X"
- "turn this voice memo into content"
- "give me a LinkedIn post"
- "give me a week of social"
- "I want to rank for [keyword]"

## Hard rules
1. **PAS framework** — every piece opens with Problem → Agitation → Solution.
2. **Outcome first** — the headline promises a result, not a feature.
3. **No jargon** — write like you'd talk to a smart friend who's busy.
4. **AEO-ready** — include a 2-3 sentence definitive answer near the top so
   ChatGPT / Google AI Overviews can quote you.
5. **Name-drop** "${lead.company_name || "the business"}" 2-3 times naturally
   for entity SEO.
6. **No text in AI-generated images.** Generate image briefs as structured
   JSON prompts; overlay text in Figma/Pillow afterwards.

## Workflow

### Step 1 — Intake
Ask the user for ONE input:
- A voice memo transcript, OR
- A bullet list of points they want to make, OR
- A customer question they keep getting asked

### Step 2 — Generate the blog post
- 1200-1800 words
- H1 + H2 structure
- FAQ section at the bottom (4-6 Q&As) for AEO
- Hero image brief (1376×768, structured JSON prompt for Gemini)
- Meta description (155 chars)
- Suggested slug

### Step 3 — Repurpose pack
From the same source, generate:
- **LinkedIn**: a 7-slide carousel arc (hook → tension → 3 insights → CTA → bio)
- **X**: 3 contrarian posts, one with a thread (5-7 tweets)
- **Instagram**: a 7-slide carousel + caption + 8 hashtags
- **TikTok**: a 60-second script with FOMO hook

### Step 4 — Distribution checklist
Output a checklist:
- [ ] Publish blog post (Vercel deploy)
- [ ] Submit to Google Search Console
- [ ] Post LinkedIn carousel
- [ ] Schedule X posts
- [ ] Post Instagram carousel
- [ ] Update sitemap

## Quick win
First 14 days: publish ONE pillar piece + repurpose. Don't try to publish 5.
Consistency beats volume early.
`;
}

function bodyQualifyLeads(lead: WorkshopLead): string {
    return `# Skill: Qualify Leads Without the Phone — for ${lead.company_name || "your business"}

You're helping ${lead.first_name || "the user"} replace inbound phone chaos with
an AI receptionist that only escalates qualified leads. Their pain:

> ${lead.business_task || "the phone never stops"}

## When to use
- "set up an AI receptionist"
- "Morgan / Vapi setup"
- "build me a lead qualifier"
- "how do I stop answering the phone"

## Architecture (proven Startup Miracle pattern)

\`\`\`
Caller → Telnyx number → Vapi agent → 3 tools
                                       ├─ GetOpenSlots (Cal.com)
                                       ├─ BookAppointment (Cal.com + Supabase)
                                       └─ SendConfirmationEmail (Resend)
                                       ↓
                                       Slack/SMS to owner if qualified
\`\`\`

## What to do

### Step 1 — Define the qualification rubric
Ask the user 3 questions:
1. What is the smallest deal you'd take? (price floor)
2. What service do you NOT want to take calls for?
3. What information must a lead provide before you'll call them back?

Produce a YES/NO qualification rubric (5 questions max) the agent asks on call.

### Step 2 — Write the agent prompt
Default prompt skeleton:
\`\`\`
You are [NAME], the AI receptionist for ${lead.company_name || "[BUSINESS]"}.
Your job:
1. Greet the caller in under 5 seconds
2. Ask their name, the service they need, and their ZIP code
3. Run the qualification rubric (1 question at a time)
4. If qualified: offer the next 3 open calendar slots, book one, confirm
5. If not qualified: politely refer them out, do not book

Voice: warm, fast, never pushy. Never longer than 2 sentences per turn.
\`\`\`

### Step 3 — Wire the tools
Use the **GetOpenSlots / BookAppointment / SendConfirmationEmail** pattern
documented in MORGAN-PLAYBOOK.md.

### Step 4 — TCPA compliance
- No outbound calls before 7:30 AM or after 8:00 PM in the lead's timezone
- Consent checkbox required on web form before any outbound
- Inbound is always allowed

### Step 5 — Test before you ship
- 10 fake calls from your phone
- 3 edge cases: angry caller, wrong number, language switch
- Log everything to Supabase, review the call transcripts

## Quick win
Day 1: forward your business line to Vapi for 1 hour during your busy
window. Listen to the call recordings. You'll know in an hour if it's ready.
`;
}

function bodyQuoteFaster(lead: WorkshopLead): string {
    return `# Skill: Quote Faster — for ${lead.company_name || "your business"}

You're helping ${lead.first_name || "the user"} go from intake to branded quote
in under 5 minutes. Industry: **${lead.company_industry || "unknown"}**.

## When to use
- "draft a quote for [customer]"
- "build my quote template"
- "turn this intake into a proposal"

## Required intake structure
Always require these fields before drafting:
\`\`\`yaml
customer_name:
customer_email:
project_name:
scope_summary:
must_haves: []
nice_to_haves: []
timeline:
budget_range:
known_risks: []
\`\`\`

If any required field is missing, ask for it. Don't guess.

## Output structure
Always produce these 4 artifacts together:

### 1. Internal scoping doc (markdown)
- Scope breakdown
- Effort estimate (hours per phase)
- Margin calculation
- Risks + assumptions

### 2. Customer-facing quote (markdown → PDF)
- Cover summary (3 sentences, outcome-first)
- What's included (bullet list)
- What's NOT included (bullet list — set boundaries)
- Investment (3 options if possible: good / better / best)
- Timeline (Gantt-style)
- Next steps (Stripe payment link)

### 3. Stripe payment link command
Use the user's Stripe account. Default to:
- Collect name, email, phone
- \`allow_promotion_codes: true\`
- Success URL: their post-purchase welcome page

### 4. Internal CRM update
Update the customer record:
\`\`\`json
{
  "stage": "proposal_sent",
  "quote_amount": 0,
  "quote_sent_at": "",
  "follow_up_at": "+3 days",
  "stripe_link": ""
}
\`\`\`

## Voice + tone
- ${lead.first_name || "The owner"} signs the quote — write in their voice.
- No "synergy", no "leverage", no "best-in-class".
- One concrete outcome per paragraph.

## Quick win
Build the template ONCE. Then every new quote = 5 min copy/paste/customize.
Aim for "quote sent within 24 hours of intake" as the new normal.
`;
}

function bodyAnswerFaster(lead: WorkshopLead): string {
    return `# Skill: Answer Customers Faster — for ${lead.company_name || "your business"}

You're helping ${lead.first_name || "the user"} clear an inbox faster without
sacrificing quality. The end state: **5-minute response time, in their voice**.

## When to use
- "draft a reply to this email"
- "triage my inbox"
- "summarize this thread"
- "what should I respond to first today?"

## Triage rubric

For every email, classify into ONE bucket:
- **NOW** — money on the table, a real customer, a hot lead
- **TODAY** — vendors, partners, scheduling
- **WEEK** — newsletters worth reading, low-urgency outreach
- **NEVER** — cold spam, unsubscribe

Output the triage as a table. NOW items get drafted replies; the rest get
a one-line "what's it about" + a suggested action.

## Drafting rules

1. **Mirror their length.** They wrote 2 lines? You write 2 lines.
2. **Lead with the answer**, not the context.
3. **One question per reply** max — don't dump questions on busy people.
4. **Sign with ${lead.first_name || "[NAME]"}'s style** — warm, fast, no
   corporate filler.

## Voice profile to maintain
Extract from past sent emails:
- Average sentence length
- Common opener ("Hey [name]," vs "Hi [name]," vs just "[name]—")
- Common closer
- Frequent phrases / pet phrases

Re-use these in every draft.

## Workflow

### Step 1 — Connect inbox
The user runs Gmail. Use the Gmail MCP if available, otherwise paste in
the threads to triage.

### Step 2 — Build the daily "inbox standup"
At a fixed time (default 9am ET), produce:
- 3 NOW items with drafts ready to send
- 1-line summaries of TODAY items
- WEEK items batched into a folder
- NEVER items auto-archived

### Step 3 — Customer record updates
Every email from an existing customer → log to the CRM:
\`\`\`json
{
  "last_inbound_at": "",
  "last_inbound_topic": "",
  "sentiment": "positive | neutral | negative",
  "follow_up_needed_at": ""
}
\`\`\`

## Quick win
Day 1: just do the triage. Don't try to draft everything. Get the inbox
visible. Drafts come on Day 3.
`;
}

function body306090(lead: WorkshopLead): string {
    return `# Skill: 30 / 60 / 90 Day Plan — for ${lead.first_name || "you"}

This is the **master planning skill**. When the user invokes it, produce a
personalized 30/60/90 day execution plan based on EVERYTHING you know about
them — their answers below, their dream, their discovery answers.

## The plan structure (always produce this format)

### First 14 days — Quick Wins (high ROI, low effort)
Pick the 3 lowest-effort actions with the highest revenue impact for THIS
specific business. Each quick win has:
- The action (verb-first)
- The expected outcome (number or %)
- The owner (${lead.first_name || "user"} OR AI OR Hermes VA)
- Day-by-day breakdown (max 5 working days each)

### Days 15–30 — Foundation
Stand up the missing infrastructure based on the discovery answers below.
Map directly: every "❌" in the discovery answers becomes a 15-30 day project.

### Days 31–60 — Compound
Layer marketing + content + outbound on top of the foundation. Measure
weekly: lead volume, response time, conversion %, average deal size.

### Days 61–90 — Scale
Hire (human or AI). Productize the things that worked. Cut the things
that didn't. Plan the next 90 days.

## Decision rules for the plan

1. **Never recommend more than 3 things at once.** Sequencing is the
   product.
2. **Every action has a measurable outcome.** "Set up CRM" is bad.
   "Capture 100% of inbound leads in Supabase with email + phone + source"
   is good.
3. **Money first.** If two paths exist — one revenue-generating, one
   foundation-building — sequence revenue first unless foundation is
   blocking revenue.
4. **Respect the team size: ${lead.company_size || "unknown"}.** Don't
   recommend a 10-person playbook to a 2-person team.
5. **Map every recommendation to one of the 5 skill modules** the user
   already has: more-sales, publish-content, qualify-leads, quote-faster,
   answer-faster. If a recommendation doesn't map to any of those, ask
   yourself if it's really a priority.

## What the user told us (their words, do not paraphrase)

**Business task to automate:**
> ${lead.business_task || "(not provided)"}

**12-month AI dream:**
> ${lead.ai_dream || "(not provided)"}

**Current AI stage:** ${lead.ai_stage || "(not provided)"}

## Output format

Produce the full 30/60/90 plan as a markdown document with:
1. An executive summary (3 sentences max)
2. The first-14-day quick wins (as a checklist with day numbers)
3. The 15-30 / 31-60 / 61-90 sections (each with measurable goals)
4. A "what could go wrong" section (top 3 risks + mitigations)
5. A "what to celebrate" section (what success at day 90 looks like)

End with: "Want me to spin this up in Linear?" — and reference the
\`linear-tracker\` skill they can run next.
`;
}

function bodyLinearTracker(lead: WorkshopLead): string {
    return `# Skill: Linear Project Tracker — for ${lead.company_name || "your business"}

When the user runs this skill, set up their Linear workspace with the
project, epics, and tickets needed to execute their 30/60/90 plan.

## Prerequisite
The user must have the **Linear MCP** connected. If it's not connected,
walk them through:
1. Go to Linear → Settings → API → Personal API key, create one
2. Run \`claude mcp add linear --env LINEAR_API_KEY=<key>\` in their terminal
3. Restart Claude Code

## What to create

### 1. Team
If no team exists: create team "${lead.company_name || "Your Company"}".

### 2. Project
Create a project called: **"AI Operating System — Q[next quarter]"**
- Description: paste the user's 12-month AI dream as the project description.
- Lead: the user.
- Target date: 90 days from today.

### 3. Epics (one per skill module the user activated)
Create one epic per skill they downloaded:
- 🎯 More Sales
- ✍️ Publish Content
- 📞 Qualify Leads (No Phone)
- ⚡ Quote Faster
- 📬 Answer Faster

Each epic gets a description pulled from the corresponding skill's "When
to use" section.

### 4. First sprint tickets (the 14-day quick wins)
For each quick win from the 30/60/90 plan, create a Linear issue:
- Title: the action (verb-first)
- Description: the expected outcome + day-by-day breakdown
- Assignee: ${lead.first_name || "the user"}
- Estimate: small / medium / large
- Labels: \`quick-win\`, \`week-1\` or \`week-2\`
- Project: the AI OS project
- Parent epic: whichever skill module it maps to

### 5. Weekly review cycle
Create a recurring ticket every Monday:
- Title: "Weekly review — what shipped, what's stuck, what's next"
- Description: a checklist mirroring the 30/60/90 measurement rubric.

## Final output

After creating everything, post a summary in chat:
- Link to the Linear project
- Number of tickets created
- The 3 tickets the user should start TODAY
- Where to find the recurring weekly review

## Notes
- Use **AI agent** as the assignee for anything Claude / Hermes can own
  on its own. The owner only sees humans-only views.
- Long-term memory lives in the Linear project description — Claude can
  re-read it next session for context.
`;
}

const SKILL_BUILDERS: Record<SkillSlug, (lead: WorkshopLead) => string> = {
    "more-sales": bodyMoreSales,
    "publish-content": bodyPublishContent,
    "qualify-leads": bodyQualifyLeads,
    "quote-faster": bodyQuoteFaster,
    "answer-faster": bodyAnswerFaster,
    "30-60-90-plan": body306090,
    "linear-tracker": bodyLinearTracker,
};

export function buildSkillMarkdown(slug: SkillSlug, lead: WorkshopLead): string {
    const meta = SKILL_CATALOG.find((s) => s.slug === slug);
    if (!meta) throw new Error(`Unknown skill: ${slug}`);
    const header = buildHeader(slug, meta.description);
    const body = SKILL_BUILDERS[slug](lead);
    const footer = buildFooter(lead);
    return `${header}\n\n${body}\n${footer}`;
}

/* ───────────────────────── Recommendation engine ───────────────────────── */

export function recommendSkills(lead: WorkshopLead): SkillSlug[] {
    const text = `${lead.business_task || ""} ${lead.ai_dream || ""}`.toLowerCase();
    const answers = lead.discovery_answers || {};
    const recs = new Set<SkillSlug>();

    if (answers.crm === "no" || answers.crm_fast_response === "no" || answers.crm_followup === "no" || answers.opt_in_form === "no") recs.add("more-sales");
    if (answers.crm_fast_response === "no") recs.add("answer-faster");
    if (answers.crm_followup === "no") recs.add("qualify-leads");
    if (answers.blog === "no") recs.add("publish-content");
    if (answers.website === "no" || answers.offer_clarity === "no") recs.add("publish-content");

    if (/sales|lead|deal|pipeline|close|client/.test(text)) recs.add("more-sales");
    if (/content|blog|seo|social|marketing|brand/.test(text)) recs.add("publish-content");
    if (/phone|call|receptionist|answering/.test(text)) recs.add("qualify-leads");
    if (/quote|proposal|estimate|bid/.test(text)) recs.add("quote-faster");
    if (/email|inbox|respond|customer service|support/.test(text)) recs.add("answer-faster");

    if (recs.size === 0) {
        recs.add("more-sales");
        recs.add("publish-content");
        recs.add("answer-faster");
    }

    return Array.from(recs);
}

// Suppress unused function warning
void joinList;
