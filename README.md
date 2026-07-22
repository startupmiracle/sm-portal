# SM Portal

**Customer portal for Startup Miracle** — workshops, skills library, glossary, and (planned) affiliate referrals.

| | |
|---|---|
| **Live URL** | [portal.startupmiracle.com](https://portal.startupmiracle.com) |
| **Repo** | [startupmiracle/sm-portal](https://github.com/startupmiracle/sm-portal) |
| **Stack** | Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Supabase Auth · shadcn/ui |

---

## What this app is

Authenticated experience for workshop attendees and SM clients:

- **Workshops** — enrollments, slide decks, profile, AI intelligence, self-assessment, skills library, setup guides, recommended tools
- **Glossary** — plain-English definitions for workshop tech terms
- **Auth** — Supabase magic-link / session login (`/login`, `/auth/callback`, `/auth/signout`)

Home (`/`) redirects to `/workshops`.

### Related systems (not this repo)

| System | Repo / host | Role |
|--------|-------------|------|
| **startupmiracle.com** (marketing + HQ CRM) | [`startupmiracle/gaaas`](https://github.com/startupmiracle/gaaas) · **Netlify** | Lead capture, `/crm/contacts`, `/crm/sales-tracker`, Stripe webhooks |
| **Shared database** | Supabase project `sdgmzizibetwhecuaist` | `leads_workshop` (this portal), `leads` (main CRM) |
| **Affiliate strategy** | [`startupmiracle/sm-ai-office`](https://github.com/startupmiracle/sm-ai-office) → `initiatives/affiliate-program/` | Product rules, schema draft, pilot (WeCanIt) |
| **Main site payments** | Stripe (live) | Standard $3k / Pro $6k; portal may use Stripe for future credit/redeem flows |

---

## Features (current)

### Workshops (`/workshops`, `/workshops/[slug]`)

- Lists enrolled workshops from Supabase `leads_workshop` (plus “coming soon” cards)
- Per-workshop portal with left sidebar + tabs:
  - Slide Deck · Your Profile · Intelligence · Self-Assessment · Questions · Setup Guide · Skills Library · Recommended Tools
- Personalized skill recommendations from discovery answers
- Downloadable Claude skill templates (`/api/portal/skill/[slug]`)

### Glossary (`/glossary`)

- Searchable term list with left nav back into workshop resources

### UI shell

- Shared **`PortalShell`** left nav: Workshops · **Referrals** · Glossary
- Workshop detail pages still use their own in-workshop sidebar tabs

### Referrals (`/referrals`) — mock UI

- How-it-works, credit stats, share link/code (copy), refer form, private mini-CRM table, program rules
- Local mock data only — not wired to Supabase/Stripe yet (see Roadmap)
- **PMO progress:** [PROGRESS.md](./PROGRESS.md)
- **Business:** first affiliate conversion (WeCanIt / Pro) logged in [sm-ai-office affiliate PROGRESS](https://github.com/startupmiracle/sm-ai-office/blob/main/initiatives/affiliate-program/PROGRESS.md)

---

## Roadmap — Referrals / affiliate hub

Existing Standard/Pro clients will recommend SM and earn **service credits toward the Social Media add-on ($3k/mo)** only (never cash, never base plan).

| Referred plan | Credit to affiliate company |
|---------------|----------------------------|
| Standard ($3k/mo) | **$1,500** (50% of MRR) |
| Pro ($6k/mo) | **$3,000** (50% of MRR) |

**Portal UX (planned under `/referrals`):**

- Share link + code (`startupmiracle.com/?ref=…` captured on the **Netlify** main site)
- Share kit (email / LinkedIn / WhatsApp / QR)
- Mini-CRM of referrals **scoped to the submitting user only** (must)
- Company-level credit balance (Stripe customer / company)

Full product rules: `sm-ai-office/initiatives/affiliate-program/`.

---

## Getting started

### Prerequisites

- Node.js 20+
- npm
- Supabase project access (same SM project as gaaas)

### Install & run

```bash
git clone https://github.com/startupmiracle/sm-portal.git
cd sm-portal
npm install
cp .env.example .env.local
# Fill env vars (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | ESLint |

---

## Environment variables

Copy from `.env.example`:

```bash
# Supabase — project ref: sdgmzizibetwhecuaist
NEXT_PUBLIC_SUPABASE_URL=https://sdgmzizibetwhecuaist.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

| Variable | Required | Notes |
|----------|----------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Shared SM Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Browser + SSR client |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Admin / privileged routes if needed |
| `STRIPE_*` | Optional today | For future redeem / billing; publishable key in Bitwarden `SM_Stripe_Publishable_Key` |

Never commit secrets. Prefer Bitwarden / host env (e.g. Vercel project settings for this portal).

---

## Project structure

```
app/
├── page.tsx                 # Redirect → /workshops
├── layout.tsx               # Root layout (fonts, metadata)
├── login/                   # Auth UI
├── auth/callback|signout/   # Supabase auth routes
├── workshops/               # Workshop list + [slug] experience
├── glossary/                # Glossary
└── api/portal/skill/[slug]/ # Skill download / generation

components/
├── portal/WorkshopPortal.tsx  # Main workshop experience
└── ui/                        # shadcn-style primitives

lib/
├── workshops.ts             # Workshop config (slugs, assets, dates)
├── skills/templates.ts      # Skill catalog + discovery + recommendations
└── utils.ts

utils/supabase/              # Browser, server, proxy session helpers
```

---

## Data model (portal-relevant)

| Table | Purpose |
|-------|---------|
| `leads_workshop` | Workshop enrollment + profile fields + discovery answers |
| `leads` | Main CRM contacts (owned by gaaas / startupmiracle.com) |
| *planned* `affiliate_*` | Company accounts, members, referrals, credit ledger (see sm-ai-office) |

Auth users log in with the email tied to workshop lead rows.

---

## Design notes

- Brand greens / zinc neutrals; warm off-white backgrounds (`#faf9f5`)
- Fonts: Inter + Outfit (headings) + Geist Mono
- Mobile: collapsible left sidebar

---

## Contributing

1. Branch from `main`
2. Keep portal changes scoped to customer UX; CRM pipeline work belongs in **gaaas** (Netlify)
3. Affiliate product rules live in **sm-ai-office** — implement here after schema lands in Supabase
4. Read `AGENTS.md` / Next.js 16 docs in `node_modules/next/dist/docs/` before non-trivial App Router work

---

## License

Private — Startup Miracle. All rights reserved.
