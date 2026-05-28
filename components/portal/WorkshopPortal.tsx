"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import {
    User,
    Building2,
    Sparkles,
    Target,
    Download,
    Copy,
    Check,
    LogOut,
    TrendingUp,
    PenTool,
    PhoneOff,
    FileText,
    MessageSquare,
    SquareKanban,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
    SKILL_CATALOG,
    DISCOVERY_QUESTIONS,
    recommendSkills,
    type WorkshopLead,
    type SkillSlug,
    type DiscoveryValue,
} from "@/lib/skills/templates";
import { createClient } from "@/utils/supabase/client";

const SM_LOGO_URL =
    "https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png";

const ICONS = {
    TrendingUp,
    PenTool,
    PhoneOff,
    FileText,
    MessageSquare,
    Target,
    Trello: SquareKanban,
};

const COLOR_MAP: Record<string, { bg: string; text: string; border: string }> = {
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200" },
    amber: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    rose: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
    fuchsia: { bg: "bg-fuchsia-50", text: "text-fuchsia-700", border: "border-fuchsia-200" },
    indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
};

export default function WorkshopPortal({ lead }: { lead: WorkshopLead }) {
    const [discoveryAnswers, setDiscoveryAnswers] = useState<Record<string, DiscoveryValue>>(
        (lead.discovery_answers as Record<string, DiscoveryValue>) || {}
    );
    const [savingDiscovery, startSavingDiscovery] = useTransition();
    const [showDiscovery, setShowDiscovery] = useState(
        !lead.discovery_answers || Object.keys(lead.discovery_answers).length < 4
    );
    const [copiedSkill, setCopiedSkill] = useState<string | null>(null);
    const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);

    const recommendedSet = new Set(recommendSkills({ ...lead, discovery_answers: discoveryAnswers }));
    const fiveSkills = SKILL_CATALOG.filter((s) => s.slug !== "30-60-90-plan" && s.slug !== "linear-tracker");
    const plan306090 = SKILL_CATALOG.find((s) => s.slug === "30-60-90-plan")!;
    const linearSkill = SKILL_CATALOG.find((s) => s.slug === "linear-tracker")!;

    const setAnswer = (key: string, value: DiscoveryValue) => {
        const next = { ...discoveryAnswers, [key]: value };
        setDiscoveryAnswers(next);
        startSavingDiscovery(async () => {
            const supabase = createClient();
            const { error } = await supabase
                .from("leads_workshop")
                .update({ discovery_answers: next })
                .eq("id", lead.id);
            if (error) console.error("discovery save failed:", error);
        });
    };

    const downloadSkill = async (slug: SkillSlug) => {
        setDownloadingSlug(slug);
        try {
            const res = await fetch(`/api/portal/skill/${slug}`);
            if (!res.ok) throw new Error("Failed to fetch skill");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${slug}.SKILL.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error(e);
            alert("Download failed. Please try again or email javier@startupmiracle.com.");
        } finally {
            setDownloadingSlug(null);
        }
    };

    const copySkillUrl = async (slug: SkillSlug) => {
        try {
            const res = await fetch(`/api/portal/skill/${slug}`);
            if (!res.ok) throw new Error("Failed to fetch skill");
            const text = await res.text();
            await navigator.clipboard.writeText(text);
            setCopiedSkill(slug);
            setTimeout(() => setCopiedSkill(null), 2000);
        } catch (e) {
            console.error(e);
        }
    };

    const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "there";
    const recommendations = (lead.recommendations as Record<string, unknown>) || {};
    const enriched = (lead.enriched_data || {}) as Record<string, string | number | null>;

    return (
        <div className="min-h-screen" style={{ backgroundColor: "#faf9f5" }}>
            {/* Header */}
            <header className="border-b border-zinc-200 bg-white">
                <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image src={SM_LOGO_URL} alt="Startup Miracle" width={36} height={36} className="rounded-full" />
                        <div>
                            <div className="text-sm font-semibold text-zinc-900">Workshop Portal</div>
                            <div className="text-xs text-zinc-500">Claude SMB Workshop</div>
                        </div>
                    </div>
                    <a
                        href="/auth/signout"
                        className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign out
                    </a>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-6 py-10 space-y-12">
                {/* Hero */}
                <section>
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">
                        <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Personalized for you
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-semibold text-zinc-900 tracking-tight">
                        Welcome, {fullName.split(" ")[0]}.
                    </h1>
                    <p className="mt-3 text-zinc-600 max-w-2xl">
                        This is your private workshop space. Everything here was built around what you told us when you
                        registered. Answer the 8 discovery questions below for a sharper 30/60/90 plan — it takes 2 minutes.
                    </p>
                </section>

                {/* 1. Your Answers */}
                <section>
                    <SectionHeader number={1} title="Your answers" subtitle="What you told us when you registered" />
                    <div className="grid md:grid-cols-2 gap-4">
                        <InfoCard
                            icon={<User className="w-4 h-4" />}
                            label="You"
                            items={[
                                ["Name", fullName],
                                ["Email", lead.email],
                                ["Role", lead.role || "—"],
                                ["Title", lead.job_title || "—"],
                            ]}
                        />
                        <InfoCard
                            icon={<Building2 className="w-4 h-4" />}
                            label="Your business"
                            items={[
                                ["Company", lead.company_name || "—"],
                                ["Industry", lead.company_industry || "—"],
                                ["Team size", lead.company_size || "—"],
                                ["AI stage", lead.ai_stage || "—"],
                            ]}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <QuoteCard
                            label="The reporting / business pain you want to automate"
                            quote={lead.business_task || "(you didn't share this yet)"}
                        />
                        <QuoteCard
                            label="Where you want AI to take you in 12 months"
                            quote={lead.ai_dream || "(you didn't share this yet)"}
                        />
                    </div>
                </section>

                {/* 2. Enriched data */}
                <section>
                    <SectionHeader
                        number={2}
                        title="What we found out about you"
                        subtitle="Startup Miracle enrichment based on your industry, company, and answers"
                    />
                    {!enriched.enrichment_status ? (
                        <Card className="border-dashed border-zinc-300">
                            <CardContent className="py-8 text-center">
                                <p className="text-sm text-zinc-500">
                                    We&apos;re hand-enriching this section before the workshop. You&apos;ll see your industry benchmarks,
                                    recommended starting stack, and competitor notes here when you sign in tomorrow.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {/* Bio + Score */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <Card className="md:col-span-2">
                                    <CardContent className="p-5">
                                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-3">About you</div>
                                        <p className="text-sm text-zinc-700 leading-relaxed">{String(enriched.person_bio || "—")}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-emerald-50 border-emerald-200">
                                    <CardContent className="p-5 flex flex-col items-center justify-center text-center">
                                        <div className="text-4xl font-bold text-emerald-700">{Number(enriched.lead_score) || 0}</div>
                                        <div className="text-xs text-emerald-600 font-medium mt-1">Lead Score</div>
                                        <div className="text-[10px] text-emerald-500 mt-0.5">out of 10</div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Company + Website */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <Card>
                                    <CardContent className="p-5">
                                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-3">Company overview</div>
                                        <p className="text-sm text-zinc-700 leading-relaxed mb-3">{String(enriched.company_description || "—")}</p>
                                        {enriched.services && (
                                            <>
                                                <div className="text-xs font-medium text-zinc-500 mt-3 mb-1.5">Services</div>
                                                <p className="text-sm text-zinc-700">{String(enriched.services)}</p>
                                            </>
                                        )}
                                        {enriched.ideal_customers && (
                                            <>
                                                <div className="text-xs font-medium text-zinc-500 mt-3 mb-1.5">Ideal customers</div>
                                                <p className="text-sm text-zinc-700">{String(enriched.ideal_customers)}</p>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-5">
                                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-3">Website audit</div>
                                        {enriched.website_screenshot_url && (
                                            <img
                                                src={String(enriched.website_screenshot_url)}
                                                alt="Website screenshot"
                                                className="w-full rounded-lg border border-zinc-200 mb-3"
                                            />
                                        )}
                                        <p className="text-sm text-zinc-700 leading-relaxed">{String(enriched.website_analysis || "—")}</p>
                                        {enriched.website_url && (
                                            <a
                                                href={String(enriched.website_url)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2 hover:underline"
                                            >
                                                Visit site &rarr;
                                            </a>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Marketing angle */}
                            {enriched.marketing_angle && (
                                <QuoteCard
                                    label="Our marketing angle for you"
                                    quote={String(enriched.marketing_angle)}
                                />
                            )}

                            {/* Social links */}
                            {(enriched.linkedin_url || enriched.twitter_url || enriched.instagram_url) && (
                                <div className="flex items-center gap-3 flex-wrap">
                                    {enriched.linkedin_url && (
                                        <a href={String(enriched.linkedin_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">
                                            LinkedIn
                                        </a>
                                    )}
                                    {enriched.twitter_url && (
                                        <a href={String(enriched.twitter_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-medium hover:bg-zinc-200 transition-colors">
                                            X / Twitter
                                        </a>
                                    )}
                                    {enriched.instagram_url && (
                                        <a href={String(enriched.instagram_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 text-xs font-medium hover:bg-pink-100 transition-colors">
                                            Instagram
                                        </a>
                                    )}
                                </div>
                            )}

                            {/* AI Recommendations */}
                            {enriched.ai_recommendations && (
                                <Card className="border-emerald-200">
                                    <CardContent className="p-5">
                                        <div className="text-xs uppercase tracking-wider text-emerald-600 font-medium mb-3">AI Recommendations</div>
                                        {(() => {
                                            try {
                                                const recs = typeof enriched.ai_recommendations === "string"
                                                    ? JSON.parse(String(enriched.ai_recommendations))
                                                    : enriched.ai_recommendations;
                                                if (!Array.isArray(recs)) return null;
                                                return (
                                                    <div className="space-y-4">
                                                        {recs.map((rec: { title?: string; tool?: string; description?: string; weekend_plan?: string }, i: number) => (
                                                            <div key={i}>
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="text-sm font-semibold text-zinc-900">{rec.title}</h4>
                                                                    {rec.tool && <Badge className="bg-violet-50 text-violet-700 border-violet-200 text-[10px]">{rec.tool}</Badge>}
                                                                </div>
                                                                <p className="text-sm text-zinc-600 leading-relaxed">{rec.description}</p>
                                                                {rec.weekend_plan && (
                                                                    <div className="mt-2 p-3 bg-zinc-50 rounded-lg text-xs text-zinc-600 whitespace-pre-line">
                                                                        <span className="font-medium text-zinc-700">Weekend plan:</span> {rec.weekend_plan}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                );
                                            } catch {
                                                return <p className="text-sm text-zinc-600">{String(enriched.ai_recommendations || "")}</p>;
                                            }
                                        })()}
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    )}
                </section>

                {/* 3. Discovery questions */}
                <section>
                    <SectionHeader
                        number={3}
                        title="2-minute self-assessment"
                        subtitle="Your answers tune every skill and the 30/60/90 plan. Update anytime."
                        right={
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowDiscovery((v) => !v)}
                                className="text-zinc-500"
                            >
                                {showDiscovery ? <ChevronUp className="w-4 h-4 mr-1" /> : <ChevronDown className="w-4 h-4 mr-1" />}
                                {showDiscovery ? "Collapse" : "Expand"}
                            </Button>
                        }
                    />
                    {showDiscovery && (
                        <Card>
                            <CardContent className="p-0 divide-y divide-zinc-100">
                                {DISCOVERY_QUESTIONS.map((q) => (
                                    <div key={q.key} className="p-5 flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="font-medium text-zinc-900 text-sm">{q.label}</div>
                                            <div className="text-xs text-zinc-500 mt-1">{q.description}</div>
                                        </div>
                                        <div className="flex gap-2">
                                            {(["yes", "no", "unsure"] as DiscoveryValue[]).map((v) => (
                                                <button
                                                    key={v}
                                                    onClick={() => setAnswer(q.key, v)}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                        discoveryAnswers[q.key] === v
                                                            ? v === "yes"
                                                                ? "bg-emerald-600 text-white"
                                                                : v === "no"
                                                                ? "bg-rose-600 text-white"
                                                                : "bg-zinc-600 text-white"
                                                            : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                                    }`}
                                                >
                                                    {v}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {savingDiscovery && (
                                    <div className="px-5 py-3 text-xs text-zinc-500 flex items-center gap-2">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </section>

                {/* 4. Skills */}
                <section>
                    <SectionHeader
                        number={4}
                        title="Your Claude skill library"
                        subtitle="Download each SKILL.md → drop into ~/.claude/skills/ (Claude Code) or paste into a new Claude project (Cowork). Highlighted skills are our top recommendations for you."
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                        {fiveSkills.map((s) => {
                            const Icon = ICONS[s.icon as keyof typeof ICONS] || Sparkles;
                            const c = COLOR_MAP[s.color] || COLOR_MAP.emerald;
                            const isRecommended = recommendedSet.has(s.slug);
                            return (
                                <SkillCard
                                    key={s.slug}
                                    slug={s.slug}
                                    title={s.title}
                                    pain={s.pain}
                                    description={s.description}
                                    icon={<Icon className="w-5 h-5" />}
                                    colorClass={c}
                                    recommended={isRecommended}
                                    downloading={downloadingSlug === s.slug}
                                    copied={copiedSkill === s.slug}
                                    onDownload={() => downloadSkill(s.slug)}
                                    onCopy={() => copySkillUrl(s.slug)}
                                />
                            );
                        })}
                    </div>
                </section>

                <Separator />

                {/* 5. Master plan */}
                <section>
                    <SectionHeader
                        number={5}
                        title="Your 30 / 60 / 90 day plan"
                        subtitle='Download this skill, then in Claude run: "Use the 30-60-90-plan skill". Claude will produce a personalized execution plan using everything above.'
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                        <BigActionCard
                            slug={plan306090.slug}
                            title={plan306090.title}
                            description={plan306090.description}
                            icon={<Target className="w-6 h-6" />}
                            cta="Download 30/60/90 skill"
                            downloading={downloadingSlug === plan306090.slug}
                            onDownload={() => downloadSkill(plan306090.slug)}
                            onCopy={() => copySkillUrl(plan306090.slug)}
                            copied={copiedSkill === plan306090.slug}
                            accentClass="from-fuchsia-500 to-pink-600"
                        />
                        <BigActionCard
                            slug={linearSkill.slug}
                            title={linearSkill.title}
                            description={linearSkill.description}
                            icon={<SquareKanban className="w-6 h-6" />}
                            cta="Download Linear skill"
                            downloading={downloadingSlug === linearSkill.slug}
                            onDownload={() => downloadSkill(linearSkill.slug)}
                            onCopy={() => copySkillUrl(linearSkill.slug)}
                            copied={copiedSkill === linearSkill.slug}
                            accentClass="from-indigo-500 to-blue-600"
                        />
                    </div>
                </section>

                {/* 6. Recommendations from SM */}
                {Object.keys(recommendations).length > 0 && (
                    <section>
                        <SectionHeader
                            number={6}
                            title="Notes from Javier"
                            subtitle="Personalized observations from our pre-workshop review"
                        />
                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-6">
                                <pre className="text-sm text-zinc-800 whitespace-pre-wrap font-sans">
                                    {typeof recommendations === "string"
                                        ? recommendations
                                        : JSON.stringify(recommendations, null, 2)}
                                </pre>
                            </CardContent>
                        </Card>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-zinc-200 pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
                    <div>
                        Stuck? Email{" "}
                        <a href="mailto:javier@startupmiracle.com" className="underline">
                            javier@startupmiracle.com
                        </a>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" />
                        New to Claude skills? Skills go in <code className="px-1 py-0.5 bg-zinc-100 rounded">~/.claude/skills/</code>
                    </div>
                </footer>
            </main>
        </div>
    );
}

/* ── Sub-components ── */

function SectionHeader({
    number,
    title,
    subtitle,
    right,
}: {
    number: number;
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
}) {
    return (
        <div className="mb-5 flex items-start justify-between gap-4">
            <div>
                <div className="text-xs font-mono text-zinc-400 mb-1">/ 0{number}</div>
                <h2 className="text-xl md:text-2xl font-semibold text-zinc-900">{title}</h2>
                {subtitle && <p className="text-sm text-zinc-600 mt-1.5 max-w-2xl">{subtitle}</p>}
            </div>
            {right}
        </div>
    );
}

function InfoCard({
    icon,
    label,
    items,
}: {
    icon: React.ReactNode;
    label: string;
    items: [string, string][];
}) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-medium mb-4">
                    {icon}
                    {label}
                </div>
                <dl className="space-y-2.5">
                    {items.map(([k, v]) => (
                        <div key={k} className="flex items-start gap-3 text-sm">
                            <dt className="w-24 text-zinc-500 flex-shrink-0">{k}</dt>
                            <dd className="text-zinc-900 font-medium">{v}</dd>
                        </div>
                    ))}
                </dl>
            </CardContent>
        </Card>
    );
}

function QuoteCard({ label, quote }: { label: string; quote: string }) {
    return (
        <div className="bg-zinc-900 text-white rounded-2xl p-5">
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium mb-3">{label}</div>
            <blockquote className="text-sm leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
        </div>
    );
}

function SkillCard({
    slug,
    title,
    pain,
    description,
    icon,
    colorClass,
    recommended,
    downloading,
    copied,
    onDownload,
    onCopy,
}: {
    slug: string;
    title: string;
    pain: string;
    description: string;
    icon: React.ReactNode;
    colorClass: { bg: string; text: string; border: string };
    recommended: boolean;
    downloading: boolean;
    copied: boolean;
    onDownload: () => void;
    onCopy: () => void;
}) {
    return (
        <Card className={`relative transition-shadow hover:shadow-sm ${recommended ? colorClass.border : ""}`}>
            <CardContent className="p-5">
                {recommended && (
                    <Badge className={`absolute top-4 right-4 text-[10px] ${colorClass.bg} ${colorClass.text} ${colorClass.border}`}>
                        Recommended for you
                    </Badge>
                )}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colorClass.bg} ${colorClass.text} mb-3`}>
                    {icon}
                </div>
                <h3 className="font-semibold text-zinc-900">{title}</h3>
                <p className="text-xs text-zinc-500 mt-1 italic">{pain}</p>
                <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center gap-2">
                    <Button
                        onClick={onDownload}
                        disabled={downloading}
                        size="sm"
                        className="flex-1 bg-zinc-900 hover:bg-zinc-800"
                    >
                        {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                        SKILL.md
                    </Button>
                    <Button
                        onClick={onCopy}
                        variant="secondary"
                        size="sm"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>
                <div className="mt-2 text-[10px] text-zinc-400 font-mono">~/.claude/skills/{slug}.md</div>
            </CardContent>
        </Card>
    );
}

function BigActionCard({
    slug,
    title,
    description,
    icon,
    cta,
    downloading,
    copied,
    onDownload,
    onCopy,
    accentClass,
}: {
    slug: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    cta: string;
    downloading: boolean;
    copied: boolean;
    onDownload: () => void;
    onCopy: () => void;
    accentClass: string;
}) {
    return (
        <Card className="relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`} />
            <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accentClass} text-white mb-4`}>
                    {icon}
                </div>
                <h3 className="font-semibold text-zinc-900 text-lg">{title}</h3>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{description}</p>
                <div className="mt-5 flex items-center gap-2">
                    <Button
                        onClick={onDownload}
                        disabled={downloading}
                        className={`flex-1 bg-gradient-to-r ${accentClass} text-white hover:opacity-95`}
                    >
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        {cta}
                    </Button>
                    <Button
                        onClick={onCopy}
                        variant="secondary"
                        size="icon"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <div className="mt-2 text-[10px] text-zinc-400 font-mono">~/.claude/skills/{slug}.md</div>
            </CardContent>
        </Card>
    );
}
