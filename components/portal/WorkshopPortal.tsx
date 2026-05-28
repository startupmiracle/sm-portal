"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
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
    Loader2,
    LayoutDashboard,
    Wrench,
    BookOpen,
    LifeBuoy,
    ClipboardList,
    ChevronDown,
    ChevronUp,
    ExternalLink,
    Menu,
    X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    TrendingUp, PenTool, PhoneOff, FileText, MessageSquare, Target, Trello: SquareKanban,
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

type Tab = "profile" | "intelligence" | "skills" | "setup" | "tools" | "assessment";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "profile", label: "Your Profile", icon: <User className="w-4 h-4" /> },
    { id: "intelligence", label: "Intelligence", icon: <Sparkles className="w-4 h-4" /> },
    { id: "skills", label: "Skills Library", icon: <Download className="w-4 h-4" /> },
    { id: "setup", label: "Setup Guide", icon: <BookOpen className="w-4 h-4" /> },
    { id: "tools", label: "Recommended Tools", icon: <Wrench className="w-4 h-4" /> },
    { id: "assessment", label: "Self-Assessment", icon: <ClipboardList className="w-4 h-4" /> },
];

export default function WorkshopPortal({ lead }: { lead: WorkshopLead }) {
    const [activeTab, setActiveTab] = useState<Tab>("profile");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [discoveryAnswers, setDiscoveryAnswers] = useState<Record<string, DiscoveryValue>>(
        (lead.discovery_answers as Record<string, DiscoveryValue>) || {}
    );
    const [savingDiscovery, startSavingDiscovery] = useTransition();
    const [copiedSkill, setCopiedSkill] = useState<string | null>(null);
    const [downloadingSlug, setDownloadingSlug] = useState<string | null>(null);

    const recommendedSet = new Set(recommendSkills({ ...lead, discovery_answers: discoveryAnswers }));
    const enriched = (lead.enriched_data || {}) as Record<string, string | number | null>;
    const fullName = [lead.first_name, lead.last_name].filter(Boolean).join(" ") || "there";

    const setAnswer = (key: string, value: DiscoveryValue) => {
        const next = { ...discoveryAnswers, [key]: value };
        setDiscoveryAnswers(next);
        startSavingDiscovery(async () => {
            const supabase = createClient();
            await supabase.from("leads_workshop").update({ discovery_answers: next }).eq("id", lead.id);
        });
    };

    const downloadSkill = async (slug: SkillSlug) => {
        setDownloadingSlug(slug);
        try {
            const res = await fetch(`/api/portal/skill/${slug}`);
            if (!res.ok) throw new Error("Failed");
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${slug}.SKILL.md`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch { alert("Download failed. Email javier@startupmiracle.com."); }
        finally { setDownloadingSlug(null); }
    };

    const copySkill = async (slug: SkillSlug) => {
        try {
            const res = await fetch(`/api/portal/skill/${slug}`);
            const text = await res.text();
            await navigator.clipboard.writeText(text);
            setCopiedSkill(slug);
            setTimeout(() => setCopiedSkill(null), 2000);
        } catch { /* noop */ }
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#faf9f5" }}>
            {/* Header */}
            <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
                <div className="px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            className="lg:hidden p-1.5 rounded-lg hover:bg-zinc-100"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <Image src={SM_LOGO_URL} alt="Startup Miracle" width={32} height={32} className="rounded-lg" />
                        <div>
                            <div className="text-sm font-semibold text-zinc-900">Workshop Portal</div>
                            <div className="text-xs text-zinc-500">Claude SMB Workshop</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-zinc-500 hidden sm:block">{lead.email}</span>
                        <a href="/auth/signout" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign out</span>
                        </a>
                    </div>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-zinc-200 pt-[57px] transform transition-transform duration-200
                    lg:relative lg:translate-x-0 lg:pt-0
                    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="p-4 space-y-1">
                        {/* Welcome */}
                        <div className="px-3 py-3 mb-2">
                            <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium">Welcome</div>
                            <div className="text-sm font-semibold text-zinc-900 mt-1">{fullName}</div>
                            <div className="text-xs text-zinc-500">{lead.company_name}</div>
                        </div>

                        <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium px-3 pt-2 pb-1">Workshop</div>
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                                    activeTab === tab.id
                                        ? "bg-emerald-50 text-emerald-700 font-medium"
                                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}

                        <div className="h-px bg-zinc-100 my-3" />

                        <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium px-3 pt-1 pb-1">Resources</div>
                        <Link
                            href="/glossary"
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                            <BookOpen className="w-4 h-4" />
                            Glossary
                        </Link>

                        <div className="h-px bg-zinc-100 my-3" />

                        <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium px-3 pt-1 pb-1">Get Help</div>
                        <a
                            href="#help"
                            onClick={(e) => { e.preventDefault(); setActiveTab("profile"); setTimeout(() => document.getElementById("get-help")?.scrollIntoView({ behavior: "smooth" }), 100); setMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                            <LifeBuoy className="w-4 h-4" />
                            Technical Call
                        </a>
                        <a
                            href="#help"
                            onClick={(e) => { e.preventDefault(); setActiveTab("profile"); setTimeout(() => document.getElementById("get-help")?.scrollIntoView({ behavior: "smooth" }), 100); setMobileMenuOpen(false); }}
                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            AI Assessment
                        </a>

                        <Link href="/workshops" className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 mt-4 transition-colors">
                            &larr; My Workshops
                        </Link>
                    </div>
                </aside>

                {/* Mobile overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-black/20 z-10 lg:hidden" onClick={() => setMobileMenuOpen(false)} />
                )}

                {/* Main content */}
                <main className="flex-1 min-w-0 p-6 lg:p-10 max-w-5xl">
                    {/* Tab bar (desktop) */}
                    <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1 border-b border-zinc-200">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                                    activeTab === tab.id
                                        ? "border-emerald-600 text-emerald-700"
                                        : "border-transparent text-zinc-500 hover:text-zinc-700 hover:border-zinc-300"
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab content */}
                    {activeTab === "profile" && (
                        <ProfileTab lead={lead} enriched={enriched} fullName={fullName} />
                    )}
                    {activeTab === "intelligence" && (
                        <IntelligenceTab enriched={enriched} />
                    )}
                    {activeTab === "skills" && (
                        <SkillsTab
                            recommendedSet={recommendedSet}
                            downloadingSlug={downloadingSlug}
                            copiedSkill={copiedSkill}
                            onDownload={downloadSkill}
                            onCopy={copySkill}
                        />
                    )}
                    {activeTab === "setup" && <SetupGuideTab />}
                    {activeTab === "tools" && <ToolsTab />}
                    {activeTab === "assessment" && (
                        <AssessmentTab
                            discoveryAnswers={discoveryAnswers}
                            savingDiscovery={savingDiscovery}
                            onAnswer={setAnswer}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}

/* ════════════════════════════════ TABS ════════════════════════════════ */

function ProfileTab({ lead, enriched, fullName }: { lead: WorkshopLead; enriched: Record<string, string | number | null>; fullName: string }) {
    return (
        <div className="space-y-8">
            <div>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-3">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Personalized for you
                </Badge>
                <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    Welcome, {fullName.split(" ")[0]}.
                </h1>
                <p className="mt-2 text-zinc-600 text-sm max-w-xl">
                    This is your private workshop space. Everything here was built around what you told us when you registered.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <InfoCard icon={<User className="w-4 h-4" />} label="You" items={[
                    ["Name", fullName],
                    ["Email", lead.email],
                    ["Role", lead.role || "—"],
                    ["Title", lead.job_title || "—"],
                ]} />
                <InfoCard icon={<Building2 className="w-4 h-4" />} label="Your business" items={[
                    ["Company", lead.company_name || "—"],
                    ["Industry", lead.company_industry || "—"],
                    ["Team size", lead.company_size || "—"],
                    ["AI stage", lead.ai_stage || "—"],
                ]} />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <QuoteCard label="The business pain you want to automate" quote={lead.business_task || "(not shared yet)"} />
                <QuoteCard label="Where you want AI to take you in 12 months" quote={lead.ai_dream || "(not shared yet)"} />
            </div>

            {/* Get Help — upsell section */}
            <div id="get-help" className="pt-4">
                <h2 className="text-lg font-semibold text-zinc-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Need expert help?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8" />
                        <CardContent className="p-6">
                            <LifeBuoy className="w-8 h-8 text-emerald-600 mb-3" />
                            <h3 className="font-semibold text-zinc-900 text-lg">Technical Call</h3>
                            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                                90-min hands-on session. We set up your AI stack together — Claude, CRM, automations. You leave with working tools, not slides.
                            </p>
                            <div className="mt-4 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-zinc-900">$450</span>
                                <span className="text-xs text-zinc-500">includes recording + memo</span>
                            </div>
                            <a
                                href="mailto:javier@startupmiracle.com?subject=Technical Call — Workshop Portal&body=Hi Javier, I'd like to book a technical call."
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                            >
                                Book a call
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </CardContent>
                    </Card>
                    <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-8 -mt-8" />
                        <CardContent className="p-6">
                            <LayoutDashboard className="w-8 h-8 text-violet-600 mb-3" />
                            <h3 className="font-semibold text-zinc-900 text-lg">AI Assessment</h3>
                            <p className="text-sm text-zinc-600 mt-2 leading-relaxed">
                                Full audit of your business through an AI lens. We map every process, score automation readiness, and deliver a prioritized roadmap.
                            </p>
                            <div className="mt-4 flex items-center gap-2">
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200">Workshop attendees: 50% off</Badge>
                            </div>
                            <a
                                href="mailto:javier@startupmiracle.com?subject=AI Assessment — Workshop Portal&body=Hi Javier, I'm interested in the AI Assessment."
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 transition-colors"
                            >
                                Learn more
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function IntelligenceTab({ enriched }: { enriched: Record<string, string | number | null> }) {
    if (!enriched.enrichment_status) {
        return (
            <Card className="border-dashed border-zinc-300">
                <CardContent className="py-12 text-center">
                    <Sparkles className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                    <p className="text-sm text-zinc-500">We&apos;re enriching your profile. Check back before the workshop.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>What we found out about you</h2>
                <p className="text-sm text-zinc-500 mt-1">Startup Miracle enrichment based on your industry, company, and public data.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardContent className="p-5">
                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-3">About you</div>
                        <p className="text-sm text-zinc-700 leading-relaxed">{String(enriched.person_bio || "—")}</p>
                    </CardContent>
                </Card>
                <Card className="bg-emerald-50 border-emerald-200">
                    <CardContent className="p-5 flex flex-col items-center justify-center text-center h-full">
                        <div className="text-4xl font-bold text-emerald-700">{Number(enriched.lead_score) || 0}</div>
                        <div className="text-xs text-emerald-600 font-medium mt-1">Lead Score</div>
                        <div className="text-[10px] text-emerald-500 mt-0.5">out of 10</div>
                    </CardContent>
                </Card>
            </div>

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
                            <img src={String(enriched.website_screenshot_url)} alt="Website screenshot" className="w-full rounded-lg border border-zinc-200 mb-3" />
                        )}
                        <p className="text-sm text-zinc-700 leading-relaxed">{String(enriched.website_analysis || "—")}</p>
                        {enriched.website_url && (
                            <a href={String(enriched.website_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium mt-2 hover:underline">
                                Visit site &rarr;
                            </a>
                        )}
                    </CardContent>
                </Card>
            </div>

            {enriched.marketing_angle && (
                <QuoteCard label="Our marketing angle for you" quote={String(enriched.marketing_angle)} />
            )}

            {(enriched.linkedin_url || enriched.twitter_url || enriched.instagram_url) && (
                <div className="flex items-center gap-3 flex-wrap">
                    {enriched.linkedin_url && <a href={String(enriched.linkedin_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">LinkedIn</a>}
                    {enriched.twitter_url && <a href={String(enriched.twitter_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-medium hover:bg-zinc-200 transition-colors">X / Twitter</a>}
                    {enriched.instagram_url && <a href={String(enriched.instagram_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 text-pink-700 text-xs font-medium hover:bg-pink-100 transition-colors">Instagram</a>}
                </div>
            )}

            {enriched.ai_recommendations && (
                <Card className="border-emerald-200">
                    <CardContent className="p-5">
                        <div className="text-xs uppercase tracking-wider text-emerald-600 font-medium mb-3">AI Recommendations</div>
                        {(() => {
                            try {
                                const recs = typeof enriched.ai_recommendations === "string" ? JSON.parse(String(enriched.ai_recommendations)) : enriched.ai_recommendations;
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
                            } catch { return <p className="text-sm text-zinc-600">{String(enriched.ai_recommendations || "")}</p>; }
                        })()}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function SkillsTab({
    recommendedSet, downloadingSlug, copiedSkill, onDownload, onCopy,
}: {
    recommendedSet: Set<SkillSlug>;
    downloadingSlug: string | null;
    copiedSkill: string | null;
    onDownload: (slug: SkillSlug) => void;
    onCopy: (slug: SkillSlug) => void;
}) {
    const fiveSkills = SKILL_CATALOG.filter((s) => s.slug !== "30-60-90-plan" && s.slug !== "linear-tracker");
    const plan306090 = SKILL_CATALOG.find((s) => s.slug === "30-60-90-plan")!;
    const linearSkill = SKILL_CATALOG.find((s) => s.slug === "linear-tracker")!;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>Your Claude Skill Library</h2>
                <p className="text-sm text-zinc-500 mt-1">Download each SKILL.md → drop into <code className="px-1 py-0.5 bg-zinc-100 rounded text-xs">~/.claude/skills/</code> or paste into a Claude project.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {fiveSkills.map((s) => {
                    const Icon = ICONS[s.icon] || Sparkles;
                    const c = COLOR_MAP[s.color] || COLOR_MAP.emerald;
                    return (
                        <SkillCard key={s.slug} slug={s.slug} title={s.title} pain={s.pain} description={s.description}
                            icon={<Icon className="w-5 h-5" />} colorClass={c} recommended={recommendedSet.has(s.slug)}
                            downloading={downloadingSlug === s.slug} copied={copiedSkill === s.slug}
                            onDownload={() => onDownload(s.slug)} onCopy={() => onCopy(s.slug)} />
                    );
                })}
            </div>

            <div className="h-px bg-zinc-200" />

            <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>Master Plan & Tracker</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <BigActionCard slug={plan306090.slug} title={plan306090.title} description={plan306090.description}
                        icon={<Target className="w-6 h-6" />} cta="Download 30/60/90 skill"
                        downloading={downloadingSlug === plan306090.slug} copied={copiedSkill === plan306090.slug}
                        onDownload={() => onDownload(plan306090.slug)} onCopy={() => onCopy(plan306090.slug)}
                        accentClass="from-fuchsia-500 to-pink-600" />
                    <BigActionCard slug={linearSkill.slug} title={linearSkill.title} description={linearSkill.description}
                        icon={<SquareKanban className="w-6 h-6" />} cta="Download Linear skill"
                        downloading={downloadingSlug === linearSkill.slug} copied={copiedSkill === linearSkill.slug}
                        onDownload={() => onDownload(linearSkill.slug)} onCopy={() => onCopy(linearSkill.slug)}
                        accentClass="from-indigo-500 to-blue-600" />
                </div>
            </div>
        </div>
    );
}

const RECOMMENDED_TOOLS: { name: string; description: string; url: string; cta: string; color: string; icon: string }[] = [
    { name: "Claude", description: "Your AI chief of staff. Best-in-class reasoning for writing, strategy, code, and decision-making. Powers every skill in this portal.", url: "https://claude.ai", cta: "Get Claude", color: "amber", icon: "sparkles" },
    { name: "Claude Skills for SMBs", description: "The 7 skills you downloaded here — install them in Claude Code or paste into Claude.ai projects. They turn Claude into your employee.", url: "#skills", cta: "View Skills", color: "emerald", icon: "download" },
    { name: "Linear", description: "Project management that humans and AI agents share. Track your 30/60/90 plan, assign tasks to yourself or AI, weekly reviews built in.", url: "https://linear.app", cta: "Get Linear", color: "indigo", icon: "kanban" },
    { name: "Granola", description: "AI meeting notes. Every call auto-transcribed and summarized. Feed transcripts to Claude for long-term memory across sessions.", url: "https://granola.ai", cta: "Get Granola", color: "violet", icon: "mic" },
    { name: "Supabase", description: "Your database and CRM in one. Postgres, auth, realtime — the backbone for lead tracking, customer data, and AI agent memory.", url: "https://supabase.com", cta: "Get Supabase", color: "emerald", icon: "database" },
    { name: "Hermes Agent", description: "Your virtual assistant layer. Human-in-the-loop for tasks AI shouldn't handle alone — scheduling, follow-ups, escalations.", url: "https://startupmiracle.com", cta: "Learn More", color: "fuchsia", icon: "bot" },
];

function SetupGuideTab() {
    const SMB_PLUGIN_URL = "https://claude.ai/redirect/claudedotcom.v1.247c9b25-baef-4c4f-8740-ff802e986118/desktop/customize/plugins/new?marketplace=anthropics/knowledge-work-plugins&plugin=small-business";

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>
                    Setup Guide: Skills &amp; Plugins
                </h2>
                <p className="text-sm text-zinc-500 mt-1 max-w-xl">
                    Learn how to supercharge Claude with Skills and Plugins. One click to install, instant value.
                </p>
            </div>

            {/* 1. Install SMB Plugin — hero CTA */}
            <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-12 -mt-12" />
                <CardContent className="p-6">
                    <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-3">
                        Recommended first step
                    </Badge>
                    <h3 className="text-xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>
                        Install the Small Business Plugin
                    </h3>
                    <p className="text-sm text-zinc-600 mt-2 leading-relaxed max-w-xl">
                        Anthropic built a plugin specifically for SMBs. It includes <strong>31 pre-built skills</strong> (payroll planning,
                        CRM cleanup, invoice chasing, content strategy, and more) plus <strong>12 connectors</strong> to your existing tools
                        (QuickBooks, PayPal, HubSpot, Stripe, Gmail, Slack, and more).
                    </p>
                    <p className="text-sm text-zinc-600 mt-2">
                        One click installs everything. You approve every step that touches money or customers.
                    </p>
                    <a
                        href={SMB_PLUGIN_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                        style={{
                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)",
                        }}
                    >
                        <Sparkles className="w-4 h-4" />
                        Install in Claude Cowork
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                </CardContent>
            </Card>

            {/* Before / After */}
            <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Before &amp; After Installing
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 flex items-center justify-center text-[10px] font-bold">1</span>
                            Before — click Install
                        </div>
                        <Card className="overflow-hidden border-zinc-200">
                            <img
                                src="/images/claude-plugin-before.jpg"
                                alt="Small Business plugin install screen — click Install"
                                className="w-full"
                            />
                        </Card>
                    </div>
                    <div>
                        <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                            After — 31 skills + 12 connectors ready
                        </div>
                        <Card className="overflow-hidden border-emerald-200">
                            <img
                                src="/images/claude-plugin-after.jpg"
                                alt="Small Business plugin installed — 31 skills and 12 connectors"
                                className="w-full"
                            />
                        </Card>
                    </div>
                </div>
            </div>

            {/* Visual tour: Getting to know Claude Customization */}
            <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Getting to Know Claude Customization
                </h3>
                <p className="text-sm text-zinc-500 mb-4">Here&apos;s what each section of Claude&apos;s Customize menu looks like. Tap any image to enlarge.</p>
                <div className="grid md:grid-cols-2 gap-4">
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-violet-500 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                                Customize Home
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Connect apps, create skills, or browse plugins — all from one place.</p>
                            <img src="/images/claude-customize-home.jpg" alt="Claude Customize home — Connect apps, Create skills, Browse plugins" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                                Skills Directory
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Browse and install individual skills by Anthropic and partners. Each one teaches Claude a new workflow.</p>
                            <img src="/images/claude-skills-directory.jpg" alt="Claude Skills Directory — browsable skills like /canvas-design, /doc-coauthoring" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                                Connectors Directory
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Connect Claude to the apps you already use — Gmail, Slack, Google Drive, Canva, and more.</p>
                            <img src="/images/claude-connectors-directory.jpg" alt="Claude Connectors — Canva, Gmail, Google Drive, Slack, Microsoft 365" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                                Plugin Preview: Productivity
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Each plugin bundles skills and connectors. Here&apos;s the Productivity plugin with task management, memory, and more.</p>
                            <img src="/images/claude-plugin-productivity.jpg" alt="Claude Productivity plugin — /memory-management, /start, /task-management, /update" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* What are Skills */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                        What are Claude Skills?
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                        Skills are reusable instructions that teach Claude <em>how</em> to do a specific job.
                        Instead of explaining your process every time, you write it once as a <code className="px-1 py-0.5 bg-zinc-100 rounded text-xs">.md</code> file
                        and Claude follows it every time.
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="p-4 bg-zinc-50 rounded-xl">
                            <div className="text-sm font-semibold text-zinc-900 mb-2">Claude Code (CLI / Desktop)</div>
                            <ol className="text-sm text-zinc-600 space-y-1.5 list-decimal list-inside">
                                <li>Download a <code className="px-1 py-0.5 bg-zinc-100 rounded text-[11px]">SKILL.md</code> from the Skills Library tab</li>
                                <li>Save it to <code className="px-1 py-0.5 bg-zinc-100 rounded text-[11px]">~/.claude/skills/</code></li>
                                <li>Claude auto-detects it next session</li>
                            </ol>
                        </div>
                        <div className="p-4 bg-zinc-50 rounded-xl">
                            <div className="text-sm font-semibold text-zinc-900 mb-2">Claude.ai (Cowork / Projects)</div>
                            <ol className="text-sm text-zinc-600 space-y-1.5 list-decimal list-inside">
                                <li>Copy skill content from the Skills Library tab</li>
                                <li>Go to your Claude project &rarr; <strong>Knowledge</strong></li>
                                <li>Paste as a new knowledge file</li>
                            </ol>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* What are Plugins */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                        What are Claude Plugins?
                    </h3>
                    <p className="text-sm text-zinc-600 leading-relaxed mb-4">
                        Plugins are curated <strong>bundles of skills + connectors</strong> built by Anthropic and partners.
                        The Small Business plugin bundles 31 ready-made workflows with 12 app integrations
                        so you don&apos;t have to wire anything yourself.
                    </p>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="text-sm font-semibold text-amber-800 mb-1">How to browse all plugins</div>
                        <p className="text-sm text-amber-700">
                            In Claude Desktop or claude.ai, go to{" "}
                            <a href="https://claude.ai/customize/skills" target="_blank" rel="noopener noreferrer" className="underline font-medium">
                                Customize &rarr; Skills &amp; Plugins
                            </a>
                            {" "}to see the full directory. You can also manage installed plugins there.
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Plugin skills list */}
            <Card className="border-zinc-200">
                <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-zinc-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                        31 Skills Included in the SMB Plugin
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4">Type any of these as a slash command in Claude after installing</p>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "/business-pulse", "/call-list", "/canva-creator", "/cash-flow-snapshot", "/close-month",
                            "/content-strategy", "/contract-review", "/crm-cleanup", "/crm-maintenance", "/customer-pulse",
                            "/customer-pulse-check", "/friday-brief", "/handle-complaint", "/invoice-chase", "/job-post-builder",
                            "/lead-triage", "/margin-analyzer", "/monday-brief", "/month-end-prep", "/month-heads-up",
                            "/plan-payroll", "/price-check", "/quarterly-review", "/review-contract", "/run-campaign",
                            "/sales-brief", "/smb-onboard", "/smb-router", "/tax-prep", "/tax-season-organizer",
                            "/ticket-deflector",
                        ].map((cmd) => (
                            <span key={cmd} className="px-2.5 py-1 bg-zinc-100 text-zinc-700 rounded-lg text-xs font-mono">
                                {cmd}
                            </span>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                        <h4 className="text-sm font-semibold text-zinc-900 mb-2">12 Connectors (via MCP)</h4>
                        <div className="flex flex-wrap gap-2">
                            {["QuickBooks", "PayPal", "HubSpot", "Canva", "Docusign", "Slack", "Stripe", "Square", "MS365", "Gmail", "Google Calendar", "Google Drive"].map((c) => (
                                <span key={c} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-medium">
                                    {c}
                                </span>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function ToolsTab() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>Recommended Tools</h2>
                <p className="text-sm text-zinc-500 mt-1">The proven stack we use and recommend. Each tool has been battle-tested across our SMB clients.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
                {RECOMMENDED_TOOLS.map((tool) => {
                    const c = COLOR_MAP[tool.color] || COLOR_MAP.emerald;
                    return (
                        <Card key={tool.name} className={`hover:shadow-md transition-all ${c.border}`}>
                            <CardContent className="p-5">
                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${c.bg} ${c.text} mb-3`}>
                                    {tool.icon === "sparkles" && <Sparkles className="w-5 h-5" />}
                                    {tool.icon === "download" && <Download className="w-5 h-5" />}
                                    {tool.icon === "kanban" && <SquareKanban className="w-5 h-5" />}
                                    {tool.icon === "mic" && <MessageSquare className="w-5 h-5" />}
                                    {tool.icon === "database" && <Building2 className="w-5 h-5" />}
                                    {tool.icon === "bot" && <Target className="w-5 h-5" />}
                                </div>
                                <h3 className="font-semibold text-zinc-900">{tool.name}</h3>
                                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{tool.description}</p>
                                {tool.url === "#skills" ? (
                                    <button className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${c.bg} ${c.text} hover:opacity-80 transition-opacity`}>
                                        {tool.cta}
                                    </button>
                                ) : (
                                    <a href={tool.url} target="_blank" rel="noopener noreferrer"
                                        className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${c.bg} ${c.text} hover:opacity-80 transition-opacity`}>
                                        {tool.cta}
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

function AssessmentTab({ discoveryAnswers, savingDiscovery, onAnswer }: {
    discoveryAnswers: Record<string, DiscoveryValue>;
    savingDiscovery: boolean;
    onAnswer: (key: string, value: DiscoveryValue) => void;
}) {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>2-Minute Self-Assessment</h2>
                <p className="text-sm text-zinc-500 mt-1">Your answers tune every skill and the 30/60/90 plan. Update anytime.</p>
            </div>
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
                                    <button key={v} onClick={() => onAnswer(q.key, v)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                            discoveryAnswers[q.key] === v
                                                ? v === "yes" ? "bg-emerald-600 text-white" : v === "no" ? "bg-rose-600 text-white" : "bg-zinc-600 text-white"
                                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                        }`}>
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
        </div>
    );
}

/* ════════════════════════════ SUB-COMPONENTS ════════════════════════════ */

function InfoCard({ icon, label, items }: { icon: React.ReactNode; label: string; items: [string, string][] }) {
    return (
        <Card>
            <CardContent className="p-5">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-medium mb-4">{icon}{label}</div>
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

function SkillCard({ slug, title, pain, description, icon, colorClass, recommended, downloading, copied, onDownload, onCopy }: {
    slug: string; title: string; pain: string; description: string; icon: React.ReactNode;
    colorClass: { bg: string; text: string; border: string }; recommended: boolean;
    downloading: boolean; copied: boolean; onDownload: () => void; onCopy: () => void;
}) {
    return (
        <Card className={`relative transition-shadow hover:shadow-sm ${recommended ? colorClass.border : ""}`}>
            <CardContent className="p-5">
                {recommended && <Badge className={`absolute top-4 right-4 text-[10px] ${colorClass.bg} ${colorClass.text} ${colorClass.border}`}>Recommended</Badge>}
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${colorClass.bg} ${colorClass.text} mb-3`}>{icon}</div>
                <h3 className="font-semibold text-zinc-900">{title}</h3>
                <p className="text-xs text-zinc-500 mt-1 italic">{pain}</p>
                <p className="text-sm text-zinc-700 mt-3 leading-relaxed">{description}</p>
                <div className="mt-4 flex items-center gap-2">
                    <Button onClick={onDownload} disabled={downloading} size="sm" className="flex-1 bg-zinc-900 hover:bg-zinc-800">
                        {downloading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" /> : <Download className="w-3.5 h-3.5 mr-1.5" />}
                        SKILL.md
                    </Button>
                    <Button onClick={onCopy} variant="secondary" size="sm">
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
                        {copied ? "Copied" : "Copy"}
                    </Button>
                </div>
                <div className="mt-2 text-[10px] text-zinc-400 font-mono">~/.claude/skills/{slug}.md</div>
            </CardContent>
        </Card>
    );
}

function BigActionCard({ slug, title, description, icon, cta, downloading, copied, onDownload, onCopy, accentClass }: {
    slug: string; title: string; description: string; icon: React.ReactNode; cta: string;
    downloading: boolean; copied: boolean; onDownload: () => void; onCopy: () => void; accentClass: string;
}) {
    return (
        <Card className="relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accentClass}`} />
            <CardContent className="p-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${accentClass} text-white mb-4`}>{icon}</div>
                <h3 className="font-semibold text-zinc-900 text-lg">{title}</h3>
                <p className="text-sm text-zinc-600 mt-2 leading-relaxed">{description}</p>
                <div className="mt-5 flex items-center gap-2">
                    <Button onClick={onDownload} disabled={downloading} className={`flex-1 bg-gradient-to-r ${accentClass} text-white hover:opacity-95`}>
                        {downloading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                        {cta}
                    </Button>
                    <Button onClick={onCopy} variant="secondary" size="icon">
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                </div>
                <div className="mt-2 text-[10px] text-zinc-400 font-mono">~/.claude/skills/{slug}.md</div>
            </CardContent>
        </Card>
    );
}
