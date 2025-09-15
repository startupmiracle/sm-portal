Startup Miracle Portal

Overview
- Vite + React + TypeScript + Tailwind + shadcn-style UI components
- Supabase (Auth, DB, Storage) client + minimal service layer
- React Router routes for multi-tenant portal and academy
- Netlify SPA deploy with redirects
- Seed script and Supabase SQL schema with RLS

Env
- Copy `.env.example` to `.env` and set:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_CAL_LINK` (e.g., `startupmiracle/15min`)

Install & Run
- npm i
- npm run dev

Build & Deploy
- Netlify: build `vite build`, publish `dist/` (see `netlify.toml`)

Supabase Schema
- Open `supabase/schema.sql` in the Supabase SQL editor and run it to create tables, enable RLS, and add policies and RPC for public proposal share.

Seeding
- Create a Service Role key in Supabase settings.
- Run:
  - `SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npm run seed`
- The script inserts:
  - Org `cpf-floors` (CPF Floors)
  - Proposal “CPF Launchpad — 9-Week Sprint” with sections and deliverables
  - Course “Startup Miracle Academy” → Module “Funnels 101” → Lesson “Speed-to-Lead & SMS Basics” + sample quiz

Routes
- `/` Landing + magic link login
- `/c/:org/overview` Org dashboard
- `/c/:org/proposals` Proposals list
- `/c/:org/proposals/:slug` Proposal detail (supports `?share=...` for public read via RPC)
- `/c/:org/academy` Course catalog
- `/c/:org/academy/:courseSlug` Course overview (enroll)
- `/c/:org/academy/:courseSlug/:moduleSlug/:lessonSlug` Lesson player + quiz
- `/account` Profile + org switch via sidebar

Public Proposal Share
- The schema adds `public.get_proposal_public(org_slug, proposal_slug, share)` which returns a proposal if `share_token` matches the `share` argument.
- In the app, call the RPC for public reads (current service methods show the approach; wire as needed).

Notes
- `src/components/ui` implements shadcn-style primitives (Card, Badge, Button, Progress) with Tailwind.
- Markdown uses `react-markdown` with GFM and `rehype-sanitize`.
- Cal.com is embedded via iframe using `VITE_CAL_LINK`.

Manual Checklist
- Create Supabase project
- In Auth > URL Configuration, add site URL (Netlify) and local dev URL to redirect URLs
- Run `supabase/schema.sql` in Supabase SQL editor
- Create Service Role key; run `npm run seed` with envs
- Set Netlify env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_CAL_LINK`
- Deploy on Netlify (auto-detect Vite build)

