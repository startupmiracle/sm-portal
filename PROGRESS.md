# SM Portal — Progress (PMO)

**Repo:** [startupmiracle/sm-portal](https://github.com/startupmiracle/sm-portal)  
**Live:** [portal.startupmiracle.com](https://portal.startupmiracle.com)  
**Last updated:** 2026-07-22

---

## Shipped

| Date | Item | Notes |
|------|------|--------|
| 2026-07 | Product README | Replaced create-next-app boilerplate; systems map, env, roadmap |
| 2026-07 | `PortalShell` | Global left nav: **Workshops · Referrals · Glossary** |
| 2026-07 | `/referrals` mock | How-it-works, credit stats, share kit, refer form, private mini-CRM table, rules |
| 2026-07 | Workshops + Glossary | Wrapped in `PortalShell` for consistent navigation |
| Prior | Workshops experience | `leads_workshop`, skills, deck, glossary, auth |

---

## In progress / not shipped

| Item | Status |
|------|--------|
| Real affiliate Supabase tables | Schema draft in sm-ai-office only |
| Company referral codes bound to Stripe customers | Mock `YOURCODE` only |
| Credit balance from ledger | Mock $0 |
| Resend “thanks for referral” | Templates in sm-ai-office ops |
| Social Media dashboard module | **Out of scope of this mock** — see Social Media package initiative |

---

## Business context (why Referrals matters now)

- Affiliate pilot **converted:** WeCanIt (Alan) referred a client who bought **Pro $6k/mo**.
- WeCanIt is entitled to **$3,000** = **1 free month** of Social Media.
- Social Media package **does not exist in Stripe yet** — fulfillment blocked.
- Portal is the future home for share kit + private mini-CRM; redeem/ops may stay HQ until automation.

Strategy source of truth:  
https://github.com/startupmiracle/sm-ai-office/tree/main/initiatives/affiliate-program

---

## Local dev note

```bash
npm run dev -- -p 3001
# open http://localhost:3001/referrals
```

Auth normally required via Supabase. Proxy may allow `/referrals` without session when env keys are missing (mock-only).

---

## Next engineering steps

1. Apply `affiliate_*` migrations (shared Supabase).  
2. Seed WCI affiliate account + members; show real $3k balance after ledger issue.  
3. Wire refer form → Supabase + CRM lead mirror.  
4. Keep Social Media client dashboard decision in package initiative (template module vs standalone).  
