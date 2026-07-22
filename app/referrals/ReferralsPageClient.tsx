"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Copy,
  Gift,
  Info,
  Link2,
  Plus,
  Share2,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import { PortalShell } from "@/components/portal/PortalShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

/** Mock only — replace with Supabase affiliate_* tables. */
const MOCK = {
  companyName: "Your company",
  referralCode: "YOURCODE",
  creditBalanceCents: 0,
  isEligible: true,
};

type ReferralStatus = "submitted" | "in_conversation" | "converted" | "lost";

type MockReferral = {
  id: string;
  name: string;
  email: string;
  company: string;
  status: ReferralStatus;
  submittedAt: string;
  expiresAt: string;
};

const STATUS_STYLES: Record<ReferralStatus, string> = {
  submitted: "bg-zinc-100 text-zinc-700 border-zinc-200",
  in_conversation: "bg-amber-50 text-amber-800 border-amber-200",
  converted: "bg-emerald-50 text-emerald-800 border-emerald-200",
  lost: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_LABEL: Record<ReferralStatus, string> = {
  submitted: "Submitted",
  in_conversation: "In conversation",
  converted: "Converted",
  lost: "Lost",
};

function formatMoney(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  }

  return (
    <div className="space-y-1.5">
      <div className="text-xs font-medium text-zinc-500">{label}</div>
      <div className="flex gap-2">
        <Input readOnly value={value} className="bg-white font-mono text-sm h-9" />
        <Button type="button" variant="outline" size="lg" onClick={copy} className="shrink-0">
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          <span className="ml-1.5 hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
        </Button>
      </div>
    </div>
  );
}

export default function ReferralsPageClient() {
  const shareUrl = useMemo(
    () => `https://startupmiracle.com/?ref=${MOCK.referralCode.toLowerCase()}`,
    []
  );

  const [referrals, setReferrals] = useState<MockReferral[]>([
    {
      id: "1",
      name: "Example Lead",
      email: "lead@example.com",
      company: "Example Co",
      status: "submitted",
      submittedAt: "2026-07-18",
      expiresAt: "2026-10-16",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    note: "",
  });
  const [submittedFlash, setSubmittedFlash] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    const now = new Date();
    const expires = new Date(now);
    expires.setDate(expires.getDate() + 90);

    setReferrals((prev) => [
      {
        id: String(Date.now()),
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim() || "—",
        status: "submitted",
        submittedAt: now.toISOString().slice(0, 10),
        expiresAt: expires.toISOString().slice(0, 10),
      },
      ...prev,
    ]);
    setForm({ name: "", email: "", company: "", phone: "", note: "" });
    setSubmittedFlash(true);
    setTimeout(() => setSubmittedFlash(false), 2500);
  }

  const pending = referrals.filter((r) => r.status === "submitted" || r.status === "in_conversation")
    .length;
  const converted = referrals.filter((r) => r.status === "converted").length;

  return (
    <PortalShell title="Customer Portal" subtitle="Referrals">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        <Users className="w-6 h-6 text-emerald-600" />
        <h1
          className="text-2xl md:text-3xl font-semibold text-zinc-900"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Referrals
        </h1>
        <Badge variant="secondary" className="bg-amber-50 text-amber-800 border-amber-200">
          Mock UI
        </Badge>
      </div>
      <p className="text-sm text-zinc-500 mb-6 max-w-2xl">
        Recommend Startup Miracle. When your lead becomes a Standard or Pro client, your company
        earns credits toward the <strong className="font-medium text-zinc-700">Social Media</strong>{" "}
        add-on ($3k/mo) — never cash, never off your base plan.
      </p>

      {/* How it works */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        {[
          {
            step: "1",
            title: "Share your link",
            body: "Send your unique link or code to founders who need AI ops.",
          },
          {
            step: "2",
            title: "They subscribe",
            body: "First successful Stripe charge on Standard ($3k) or Pro ($6k).",
          },
          {
            step: "3",
            title: "Earn SM credits",
            body: "50% of their plan MRR as credit toward Social Media for your company.",
          },
        ].map((s) => (
          <Card key={s.step} className="bg-white">
            <CardContent className="p-4">
              <div className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center justify-center mb-2">
                {s.step}
              </div>
              <div className="text-sm font-semibold text-zinc-900">{s.title}</div>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{s.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-3 mb-8">
        <Card className="bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-50">
              <Wallet className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <div className="text-xs text-zinc-500">Company credit balance</div>
              <div className="text-xl font-semibold text-zinc-900 tabular-nums">
                {formatMoney(MOCK.creditBalanceCents)}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Social Media only · mock</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-50">
              <Share2 className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="text-xs text-zinc-500">Open referrals</div>
              <div className="text-xl font-semibold text-zinc-900 tabular-nums">{pending}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Your submissions only</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white">
          <CardContent className="p-4 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-violet-50">
              <Gift className="w-4 h-4 text-violet-700" />
            </div>
            <div>
              <div className="text-xs text-zinc-500">Converted</div>
              <div className="text-xl font-semibold text-zinc-900 tabular-nums">{converted}</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Std $1.5k · Pro $3k credit
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Share kit */}
      <Card className="bg-white mb-8">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-base">Your share kit</CardTitle>
          </div>
          <CardDescription>
            Link hits startupmiracle.com with your ref code (90-day attribution). Codes are mock
            until affiliate accounts are wired.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <CopyField label="Referral link" value={shareUrl} />
          <CopyField label="Referral code" value={MOCK.referralCode} />
          <div className="rounded-lg bg-zinc-50 border border-zinc-100 p-3 text-xs text-zinc-600 leading-relaxed">
            <span className="font-medium text-zinc-800">Suggested blurb: </span>
            We&apos;re using Startup Miracle for AI ops — happy to intro you. Use my link: {shareUrl}
          </div>
        </CardContent>
      </Card>

      {/* Refer widget + mini CRM */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        <Card className="bg-white lg:col-span-2">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" />
              <CardTitle className="text-base">Refer someone</CardTitle>
            </div>
            <CardDescription>
              Sends to your mini-CRM only (not other teammates). Backend not connected yet.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <form onSubmit={onSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-500">Name *</label>
                <Input
                  className="mt-1 h-9 bg-white"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Debbie Shlesinger"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Email *</label>
                <Input
                  type="email"
                  className="mt-1 h-9 bg-white"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="debbie@company.com"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Company</label>
                <Input
                  className="mt-1 h-9 bg-white"
                  value={form.company}
                  onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                  placeholder="Rok Lending"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Phone</label>
                <Input
                  className="mt-1 h-9 bg-white"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="+1 …"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-zinc-500">Note to SM</label>
                <Input
                  className="mt-1 h-9 bg-white"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="Context for the team"
                />
              </div>
              <Button type="submit" className="w-full h-9 bg-emerald-600 hover:bg-emerald-700 text-white">
                Submit referral
              </Button>
              {submittedFlash && (
                <p className="text-xs text-emerald-700 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  Added to your list (local mock only).
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white lg:col-span-3">
          <CardHeader className="border-b border-zinc-100 pb-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <CardTitle className="text-base">My referrals</CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px] font-normal">
                Private to you
              </Badge>
            </div>
            <CardDescription>
              Only referrals you submitted. Company credit balance is shared; this list is not.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-xs text-zinc-400">
                    <th className="px-4 py-2.5 font-medium">Lead</th>
                    <th className="px-4 py-2.5 font-medium hidden sm:table-cell">Company</th>
                    <th className="px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5 font-medium hidden md:table-cell">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-10 text-center text-zinc-400 text-sm">
                        No referrals yet — share your link or use the form.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((r) => (
                      <tr key={r.id} className="border-b border-zinc-50 last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium text-zinc-900">{r.name}</div>
                          <div className="text-xs text-zinc-400">{r.email}</div>
                        </td>
                        <td className="px-4 py-3 text-zinc-600 hidden sm:table-cell">{r.company}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full border ${STATUS_STYLES[r.status]}`}
                          >
                            {STATUS_LABEL[r.status]}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-zinc-400 hidden md:table-cell">
                          {r.expiresAt}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules */}
      <Card className="bg-white mb-6">
        <CardHeader className="border-b border-zinc-100 pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-emerald-600" />
            <CardTitle className="text-base">Program rules (summary)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <ul className="space-y-2 text-sm text-zinc-600">
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              Active Standard or Pro clients only; credits accrue to the <strong className="font-medium">company</strong>.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              Credit = <strong className="font-medium">50%</strong> of referred plan MRR once (Standard → $1.5k, Pro → $3k).
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              Applies only to the <strong className="font-medium">Social Media</strong> add-on — never base subscription or cash.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              90-day attribution window; refunds claw back credit unless SM approves in writing.
            </li>
            <li className="flex gap-2">
              <span className="text-emerald-600 shrink-0">•</span>
              Credits expire if your underlying SM subscription ends. Redeem is manual (Stripe coupon) for now.
            </li>
          </ul>
          <p className="text-xs text-zinc-400 mt-4">
            Full terms will live on startupmiracle.com/terms (Affiliate section). This page is a UI mock —
            no live billing or CRM write yet.
          </p>
        </CardContent>
      </Card>

      <footer className="border-t border-zinc-200 pt-6 text-center text-xs text-zinc-400">
        Powered by{" "}
        <a
          href="https://startupmiracle.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-zinc-600"
        >
          Startup Miracle
        </a>
      </footer>
    </PortalShell>
  );
}
