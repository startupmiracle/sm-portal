"use client";

import { useState, useTransition, useEffect, useCallback } from "react";
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
    Globe,
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
import {
    Label,
    PolarGrid,
    PolarRadiusAxis,
    RadialBar,
    RadialBarChart,
} from "recharts";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";

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
    { id: "assessment", label: "Self-Assessment", icon: <ClipboardList className="w-4 h-4" /> },
    { id: "setup", label: "Setup Guide", icon: <BookOpen className="w-4 h-4" /> },
    { id: "skills", label: "Skills Library", icon: <Download className="w-4 h-4" /> },
    { id: "tools", label: "Recommended Tools", icon: <Wrench className="w-4 h-4" /> },
];

const VALID_TABS = new Set<string>(["profile", "intelligence", "skills", "setup", "tools", "assessment"]);

export default function WorkshopPortal({ lead }: { lead: WorkshopLead }) {
    const [activeTab, setActiveTabState] = useState<Tab>("profile");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const setActiveTab = useCallback((tab: Tab) => {
        setActiveTabState(tab);
        window.history.replaceState(null, "", `#${tab}`);
    }, []);

    // Read hash on mount + listen for popstate
    useEffect(() => {
        const readHash = () => {
            const hash = window.location.hash.replace("#", "");
            if (VALID_TABS.has(hash)) setActiveTabState(hash as Tab);
        };
        readHash();
        window.addEventListener("hashchange", readHash);
        return () => window.removeEventListener("hashchange", readHash);
    }, []);
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
                    <span className="text-sm text-zinc-500 hidden sm:block">{lead.email}</span>
                </div>
            </header>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className={`
                    fixed inset-y-0 left-0 z-20 w-64 bg-white border-r border-zinc-200 pt-[57px] transform transition-transform duration-200
                    lg:sticky lg:top-[57px] lg:translate-x-0 lg:pt-0 lg:h-[calc(100vh-57px)] lg:flex-shrink-0
                    ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                `}>
                    <div className="p-4 space-y-1 overflow-y-auto h-[calc(100%-60px)] pb-4">
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

                    {/* Footer — pinned bottom */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white">
                        <div className="mx-4 border-t border-zinc-100" />
                        <div className="p-4 space-y-1">
                            <a
                                href="https://startupmiracle.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                            >
                                <Globe className="w-4 h-4" />
                                Startup Miracle
                            </a>
                            <a
                                href="/auth/signout"
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign out
                            </a>
                        </div>
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
                    {activeTab === "tools" && <ToolsTab onNavigate={setActiveTab} />}
                    {activeTab === "assessment" && (
                        <AssessmentTab
                            discoveryAnswers={discoveryAnswers}
                            savingDiscovery={savingDiscovery}
                            onAnswer={setAnswer}
                            enriched={enriched}
                            lead={lead}
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
                <Card>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-zinc-500 font-medium mb-4">
                            <User className="w-4 h-4" />You
                        </div>
                        <dl className="space-y-2.5">
                            {([["Name", fullName], ["Email", lead.email], ["Role", lead.role || "—"], ["Title", lead.job_title || "—"]] as [string, string][]).map(([k, v]) => (
                                <div key={k} className="flex items-start gap-3 text-sm">
                                    <dt className="w-24 text-zinc-500 flex-shrink-0">{k}</dt>
                                    <dd className="text-zinc-900 font-medium">{v}</dd>
                                </div>
                            ))}
                        </dl>
                        {(enriched.linkedin_url || enriched.twitter_url || enriched.instagram_url || enriched.facebook_url || enriched.youtube_url) && (
                            <div className="mt-4 pt-3 border-t border-zinc-100">
                                <div className="text-xs text-zinc-500 font-medium mb-2">Social</div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {enriched.linkedin_url && (
                                        <a href={String(enriched.linkedin_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">LinkedIn</a>
                                    )}
                                    {enriched.twitter_url && (
                                        <a href={String(enriched.twitter_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-medium hover:bg-zinc-200 transition-colors">X / Twitter</a>
                                    )}
                                    {enriched.instagram_url && (
                                        <a href={String(enriched.instagram_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-pink-50 text-pink-700 text-xs font-medium hover:bg-pink-100 transition-colors">Instagram</a>
                                    )}
                                    {enriched.facebook_url && (
                                        <a href={String(enriched.facebook_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium hover:bg-blue-100 transition-colors">Facebook</a>
                                    )}
                                    {enriched.youtube_url && (
                                        <a href={String(enriched.youtube_url)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors">YouTube</a>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
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
                            <ZoomImage src={String(enriched.website_screenshot_url)} alt="Website screenshot" className="w-full rounded-lg border border-zinc-200 mb-3" />
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

            {/* How to upload skills */}
            <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row gap-5">
                        <div className="flex-1">
                            <h3 className="font-semibold text-zinc-900 mb-2 flex items-center gap-2">
                                <Download className="w-4 h-4 text-amber-600" />
                                How to upload a skill to Claude Desktop
                            </h3>
                            <div className="text-sm text-zinc-600 space-y-2">
                                <p>Follow this path inside the Claude Desktop app:</p>
                                <div className="flex items-center gap-1.5 flex-wrap text-xs font-medium">
                                    <span className="px-2 py-1 bg-white rounded-lg border border-zinc-200">Claude</span>
                                    <span className="text-zinc-400">&rarr;</span>
                                    <span className="px-2 py-1 bg-white rounded-lg border border-zinc-200">Settings</span>
                                    <span className="text-zinc-400">&rarr;</span>
                                    <span className="px-2 py-1 bg-white rounded-lg border border-zinc-200">Skills</span>
                                    <span className="text-zinc-400">&rarr;</span>
                                    <span className="px-2 py-1 bg-white rounded-lg border border-zinc-200">+ Create a Skill</span>
                                    <span className="text-zinc-400">&rarr;</span>
                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-lg border border-amber-200">Upload a Skill</span>
                                </div>
                                <p className="text-xs text-zinc-500 mt-2">Select the <code className="px-1 py-0.5 bg-white rounded text-[11px]">.SKILL.md</code> file you downloaded from below. Claude will recognize it immediately.</p>
                            </div>
                        </div>
                        <div className="md:w-80 flex-shrink-0">
                            <ZoomImage src="/images/claude-skills-upload.jpg" alt="Claude Desktop — Settings → Skills → Create a Skill → Upload a Skill" className="w-full rounded-lg border border-zinc-200 shadow-sm" />
                        </div>
                    </div>
                </CardContent>
            </Card>

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

type ToolCategory = "All" | "AI Agents" | "Website" | "Email" | "Banking" | "Payments" | "Database" | "Communications" | "Project Management" | "Creative" | "Security";

const TOOL_CATEGORIES: ToolCategory[] = ["All", "AI Agents", "Creative", "Communications", "Database", "Email", "Payments", "Banking", "Website", "Security", "Project Management"];

const RECOMMENDED_TOOLS: { name: string; description: string; url: string; cta: string; color: string; icon: string; category: ToolCategory }[] = [
    { name: "Claude", description: "Your AI chief of staff. Best-in-class reasoning for writing, strategy, code, and decision-making. Powers every skill in this portal.", url: "https://claude.ai", cta: "Get Claude", color: "amber", icon: "sparkles", category: "AI Agents" },
    { name: "Claude Skills for SMBs", description: "The 7 skills you downloaded here — install them in Claude Code or paste into Claude.ai projects. They turn Claude into your employee.", url: "#skills", cta: "View Skills", color: "emerald", icon: "download", category: "AI Agents" },
    { name: "Hermes Agent", description: "A persistent, self-improving AI assistant that lives in your Telegram, WhatsApp, browser, or Slack. Solves complex problems, finishes repetitive tasks, and gets smarter over time with long-term memory, integrations, and self-improvement loops.", url: "https://hermes-agent.nousresearch.com/", cta: "Learn More", color: "fuchsia", icon: "bot", category: "AI Agents" },
    { name: "HeyGen", description: "Create presenter and UGC videos with your AI avatar. Record once, generate unlimited variations. Connects to Claude via MCP for automated video workflows.", url: "https://www.heygen.com/", cta: "Get HeyGen", color: "rose", icon: "sparkles", category: "Creative" },
    { name: "Higgsfield", description: "Advanced creative studio for AI-generated video, images, and product shoots. Full MCP integration with Claude for end-to-end content pipelines.", url: "https://higgsfield.ai/", cta: "Get Higgsfield", color: "amber", icon: "sparkles", category: "Creative" },
    { name: "Slack", description: "Your virtual office. Connect multiple tools and bots via MCP connectors, run your Hermes Agent, and centralize team + AI communication in channels.", url: "https://slack.com", cta: "Get Slack", color: "violet", icon: "mic", category: "Communications" },
    { name: "Telegram", description: "The easiest hub for your Hermes Agent. Set up in minutes with Telegram BotFather — your AI assistant is always one message away, on any device.", url: "https://telegram.org/", cta: "Get Telegram", color: "blue", icon: "bot", category: "Communications" },
    { name: "Granola", description: "AI meeting notes. Every call auto-transcribed and summarized. Feed transcripts to Claude for long-term memory across sessions.", url: "https://granola.ai", cta: "Get Granola", color: "violet", icon: "mic", category: "Communications" },
    { name: "Supabase", description: "Your database and CRM in one. Postgres, auth, realtime — the backbone for lead tracking, customer data, and AI agent memory.", url: "https://supabase.com", cta: "Get Supabase", color: "emerald", icon: "database", category: "Database" },
    { name: "Resend", description: "Transactional emails that land in your client's main inbox — not spam. Beautiful templates, webhooks, and analytics. Built for developers and AI agents alike.", url: "https://resend.com/", cta: "Get Resend", color: "blue", icon: "mic", category: "Email" },
    { name: "Stripe", description: "Process payments easily — one-off charges, recurring subscriptions, invoices. Payment links, checkout pages, and webhooks that plug into your CRM and automations.", url: "https://stripe.com/", cta: "Get Stripe", color: "violet", icon: "database", category: "Payments" },
    { name: "Mercury Bank", description: "Your company's bank account with Stripe fully integrated, accounting books due-diligence ready, and your CPA costs down. Built for startups and SMBs.", url: "https://mercury.com/", cta: "Get Mercury", color: "indigo", icon: "database", category: "Banking" },
    { name: "Vercel", description: "Host your websites and web apps securely — free tier included. One-click deploys from GitHub, instant previews, and edge performance out of the box.", url: "https://vercel.com/", cta: "Get Vercel", color: "indigo", icon: "kanban", category: "Website" },
    { name: "Cloudflare", description: "Manage your domains, DNS records, and security in one place. Free SSL, DDoS protection, and bot management for every site you run.", url: "https://www.cloudflare.com/", cta: "Get Cloudflare", color: "amber", icon: "database", category: "Website" },
    { name: "Bitwarden", description: "Centralized password and secrets manager. Store API keys, credentials, and tokens in one vault — then share access securely with your agents (Claude, Hermes, Codex).", url: "https://bitwarden.com/", cta: "Get Bitwarden", color: "blue", icon: "database", category: "Security" },
    { name: "Microsoft Azure", description: "12 months of free virtual private servers to host your Hermes agents. Always-on compute for AI assistants that need to run 24/7.", url: "https://azure.microsoft.com/en-us/pricing/free-services", cta: "Get Free VPS", color: "blue", icon: "database", category: "Website" },
    { name: "Linear", description: "Project management that humans and AI agents share. Track your 30/60/90 plan, assign tasks to yourself or AI, weekly reviews built in.", url: "https://linear.app", cta: "Get Linear", color: "indigo", icon: "kanban", category: "Project Management" },
];

function SetupGuideTab() {
    const SMB_PLUGIN_URL = "https://claude.ai/redirect/claudedotcom.v1.247c9b25-baef-4c4f-8740-ff802e986118/desktop/customize/plugins/new?marketplace=anthropics/knowledge-work-plugins&plugin=small-business";

    return (
        <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 min-w-0 space-y-8">

            {/* What is Claude Cowork? */}
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>
                    What is Claude Cowork?
                </h2>
                <p className="text-sm text-zinc-500 mt-1 max-w-xl">
                    Cowork is Claude&apos;s collaborative workspace — think of it as a shared office where you and AI work side by side on real tasks, not just chat.
                </p>
            </div>

            <div className="relative w-full overflow-hidden rounded-2xl border border-zinc-200 shadow-sm" style={{ paddingBottom: "56.25%" }}>
                <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/Lbml7IuGJYw?si=uxRYR3b7ov3xu0yW"
                    title="What is Claude Cowork?"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>

            {/* Setup Guide: Skills & Plugins */}
            <div className="pt-4">
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
                            <ZoomImage
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
                            <ZoomImage
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
                            <ZoomImage src="/images/claude-customize-home.jpg" alt="Claude Customize home — Connect apps, Create skills, Browse plugins" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                                Skills Directory
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Browse and install individual skills by Anthropic and partners. Each one teaches Claude a new workflow.</p>
                            <ZoomImage src="/images/claude-skills-directory.jpg" alt="Claude Skills Directory — browsable skills like /canvas-design, /doc-coauthoring" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                                Connectors Directory
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Connect Claude to the apps you already use — Gmail, Slack, Google Drive, Canva, and more.</p>
                            <ZoomImage src="/images/claude-connectors-directory.jpg" alt="Claude Connectors — Canva, Gmail, Google Drive, Slack, Microsoft 365" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                    <Card className="overflow-hidden">
                        <CardContent className="p-4">
                            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2 flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-fuchsia-500 text-white flex items-center justify-center text-[10px] font-bold">4</span>
                                Plugin Preview: Productivity
                            </div>
                            <p className="text-xs text-zinc-500 mb-3">Each plugin bundles skills and connectors. Here&apos;s the Productivity plugin with task management, memory, and more.</p>
                            <ZoomImage src="/images/claude-plugin-productivity.jpg" alt="Claude Productivity plugin — /memory-management, /start, /task-management, /update" className="w-full rounded-lg border border-zinc-200" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Official Claude Plugins to install */}
            <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                    Official Plugins We Recommend
                </h3>
                <p className="text-sm text-zinc-500 mb-4">Install these directly from Anthropic. Each one adds specialized skills and connectors to your Claude.</p>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        {
                            name: "Small Business",
                            description: "31 skills for payroll, CRM, invoicing, content strategy + 12 connectors (QuickBooks, Stripe, HubSpot, Gmail).",
                            url: "https://claude.ai/redirect/claudedotcom.v1.247c9b25-baef-4c4f-8740-ff802e986118/desktop/customize/plugins/new?marketplace=anthropics/knowledge-work-plugins&plugin=small-business",
                            color: "emerald",
                            badge: "Must install",
                        },
                        {
                            name: "Productivity",
                            description: "Task management, two-tier memory, daily briefings. Syncs with calendar, email, and chat.",
                            url: "https://claude.ai/directory/plugins/productivity%40Anthropic%20%26%20Partners",
                            color: "violet",
                            image: "/images/claude-plugin-productivity.jpg",
                        },
                        {
                            name: "Sales",
                            description: "Prospect research, call prep, competitive intel, deal strategy, personalized outreach. Customized for Startup Miracle.",
                            url: "https://claude.ai/directory/plugins/sales%40My%20Uploads",
                            color: "amber",
                            image: "/images/claude-plugin-sales.jpg",
                        },
                    ].map((plugin) => {
                        const c = COLOR_MAP[plugin.color] || COLOR_MAP.emerald;
                        return (
                            <Card key={plugin.name} className={`${c.border} hover:shadow-md transition-all`}>
                                <CardContent className="p-5 flex flex-col h-full">
                                    {plugin.badge && (
                                        <Badge className={`${c.bg} ${c.text} ${c.border} mb-3 w-fit text-[10px]`}>{plugin.badge}</Badge>
                                    )}
                                    {plugin.image && (
                                        <ZoomImage src={plugin.image} alt={plugin.name} className="w-full rounded-lg border border-zinc-200 mb-3" />
                                    )}
                                    <h4 className="font-semibold text-zinc-900">{plugin.name}</h4>
                                    <p className="text-xs text-zinc-600 mt-1.5 leading-relaxed flex-1">{plugin.description}</p>
                                    <a
                                        href={plugin.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`mt-4 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${c.bg} ${c.text} hover:opacity-80 transition-opacity w-full`}
                                    >
                                        Install Plugin
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </CardContent>
                            </Card>
                        );
                    })}
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

            {/* Right sidebar — Claude signup banner */}
            <div className="hidden xl:block w-56 flex-shrink-0">
                <div className="sticky top-20">
                    <a
                        href="https://claude.ai/login"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-2xl overflow-hidden border border-zinc-200 hover:border-emerald-300 hover:shadow-lg transition-all group"
                    >
                        <img
                            src="/images/claude-signup-banner.png"
                            alt="Create your Claude account — Think fast, build faster"
                            className="w-full"
                        />
                        <div className="p-3 bg-white text-center">
                            <div className="text-xs font-semibold text-zinc-900">Don&apos;t have Claude yet?</div>
                            <div className="text-[11px] text-emerald-600 font-medium mt-0.5 group-hover:underline">
                                Create free account &rarr;
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    );
}

function ToolsTab({ onNavigate }: { onNavigate: (tab: Tab) => void }) {
    const [activeCategory, setActiveCategory] = useState<ToolCategory>("All");
    const filtered = activeCategory === "All" ? RECOMMENDED_TOOLS : RECOMMENDED_TOOLS.filter(t => t.category === activeCategory);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>Recommended Tools</h2>
                <p className="text-sm text-zinc-500 mt-1">The proven stack we use and recommend. Every tool integrates with Claude and Claude Code for setup.</p>
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
                {TOOL_CATEGORIES.map((cat) => {
                    const count = cat === "All" ? RECOMMENDED_TOOLS.length : RECOMMENDED_TOOLS.filter(t => t.category === cat).length;
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                                activeCategory === cat
                                    ? "bg-zinc-900 text-white"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            }`}
                        >
                            {cat} <span className="ml-1 opacity-60">{count}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {filtered.map((tool) => {
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
                                    <button onClick={() => onNavigate("skills")} className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${c.bg} ${c.text} hover:opacity-80 transition-opacity`}>
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

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex items-start gap-3">
                <Wrench className="w-5 h-5 text-zinc-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-zinc-600">
                    <span className="font-medium text-zinc-900">Pro tip:</span> Your downloaded skills already know this recommended tech stack.
                    When in doubt, ask your <a href="https://claude.ai" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium hover:underline">Claude Code</a> to set up and connect any of these tools for you.
                </div>
            </div>
        </div>
    );
}

function AssessmentTab({ discoveryAnswers, savingDiscovery, onAnswer, enriched, lead }: {
    discoveryAnswers: Record<string, DiscoveryValue>;
    savingDiscovery: boolean;
    onAnswer: (key: string, value: DiscoveryValue) => void;
    enriched: Record<string, string | number | null>;
    lead: WorkshopLead;
}) {
    // Auto-populate suggestions based on enrichment data
    const autoSuggestions: Record<string, { value: DiscoveryValue; reason: string }> = {};

    if (enriched.website_status === "live" || enriched.website_url) {
        autoSuggestions.website = { value: "yes", reason: `We found your site: ${enriched.website_url || "live"}` };
    }

    const analysisText = String(enriched.website_analysis || "").toLowerCase();
    if (analysisText.includes("lead capture") || analysisText.includes("opt-in") || analysisText.includes("contact form")) {
        autoSuggestions.opt_in_form = analysisText.includes("lack") || analysisText.includes("missing") || analysisText.includes("no lead capture") || analysisText.includes("could benefit")
            ? { value: "no", reason: "Our audit found no lead capture form on your site" }
            : { value: "yes", reason: "We detected a form on your site" };
    } else if (enriched.website_status === "live") {
        autoSuggestions.opt_in_form = { value: "no", reason: "No lead capture form detected during site audit" };
    }

    if (enriched.linkedin_url || enriched.twitter_url) {
        autoSuggestions.blog = { value: "unsure", reason: "You have social presence — but do you publish indexable blog content?" };
    }

    const businessTask = (lead.business_task || "").toLowerCase();
    if (/crm|hubspot|supabase|salesforce/.test(businessTask) || /crm/.test(String(enriched.services || "").toLowerCase())) {
        autoSuggestions.crm = { value: "yes", reason: "You mentioned CRM in your registration" };
    }

    // Scoring: yes = 10, unsure = 5, no = 0. Include auto-suggestions for unanswered.
    const totalQuestions = DISCOVERY_QUESTIONS.length;
    const maxScore = totalQuestions * 10;
    let answeredCount = 0;
    let score = 0;
    for (const q of DISCOVERY_QUESTIONS) {
        const val = discoveryAnswers[q.key] || autoSuggestions[q.key]?.value;
        if (val) {
            answeredCount++;
            if (val === "yes") score += 10;
            else if (val === "unsure") score += 5;
        }
    }
    const pct = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    const endAngle = (pct / 100) * 360;
    const scoreColor = pct >= 70 ? "hsl(152, 76%, 36%)" : pct >= 40 ? "hsl(45, 93%, 47%)" : "hsl(0, 72%, 51%)";
    const scoreLabel = pct >= 70 ? "Strong" : pct >= 40 ? "Getting there" : "Needs work";

    const chartConfig: ChartConfig = {
        score: { label: "Score", color: scoreColor },
    };
    const chartData = [{ name: "score", value: pct, fill: scoreColor }];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>Self-Assessment</h2>
                <p className="text-sm text-zinc-500 mt-1">Your answers tune every skill and the 30/60/90 plan. Update anytime.</p>
                {Object.keys(autoSuggestions).length > 0 && Object.keys(discoveryAnswers).length === 0 && (
                    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-emerald-700">
                            We pre-filled some answers based on your enrichment data. Review and adjust — you know your business best.
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Questions — 70% */}
                <div className="flex-1 min-w-0 lg:w-[70%]">
                    <Card>
                        <CardContent className="p-0 divide-y divide-zinc-100">
                            {DISCOVERY_QUESTIONS.map((q) => {
                                const current = discoveryAnswers[q.key];
                                const suggestion = autoSuggestions[q.key];
                                const displayValue = current || suggestion?.value;

                                return (
                                    <div key={q.key} className="p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="font-medium text-zinc-900 text-sm">{q.label}</div>
                                                <div className="text-xs text-zinc-500 mt-1">{q.description}</div>
                                                {suggestion && !current && (
                                                    <div className="mt-1.5 text-[11px] text-emerald-600 flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" />
                                                        {suggestion.reason}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                {(["yes", "no", "unsure"] as DiscoveryValue[]).map((v) => (
                                                    <button key={v} onClick={() => onAnswer(q.key, v)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                                            displayValue === v
                                                                ? v === "yes"
                                                                    ? current ? "bg-emerald-600 text-white" : "bg-emerald-400 text-white ring-1 ring-emerald-300 ring-offset-1"
                                                                    : v === "no"
                                                                    ? current ? "bg-rose-600 text-white" : "bg-rose-400 text-white ring-1 ring-rose-300 ring-offset-1"
                                                                    : current ? "bg-zinc-600 text-white" : "bg-zinc-400 text-white ring-1 ring-zinc-300 ring-offset-1"
                                                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                                                        }`}>
                                                        {v}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            {savingDiscovery && (
                                <div className="px-5 py-3 text-xs text-zinc-500 flex items-center gap-2">
                                    <Loader2 className="w-3 h-3 animate-spin" /> Saving...
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Score — 30% */}
                <div className="lg:w-[30%] flex-shrink-0">
                    <div className="sticky top-20">
                        <Card>
                            <CardContent className="p-5 flex flex-col items-center">
                                <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium mb-2">Your Readiness Score</div>
                                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[200px] w-full">
                                    <RadialBarChart
                                        data={chartData}
                                        startAngle={90}
                                        endAngle={90 - endAngle}
                                        outerRadius={85}
                                        innerRadius={70}
                                    >
                                        <PolarGrid
                                            gridType="circle"
                                            radialLines={false}
                                            stroke="none"
                                            className="first:fill-muted last:fill-background"
                                            polarRadius={[85, 70]}
                                        />
                                        <RadialBar dataKey="value" background cornerRadius={10} />
                                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                                        return (
                                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 8} className="fill-foreground text-3xl font-bold">
                                                                    {score}
                                                                </tspan>
                                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 14} className="fill-muted-foreground text-xs">
                                                                    / {maxScore}
                                                                </tspan>
                                                            </text>
                                                        );
                                                    }
                                                }}
                                            />
                                        </PolarRadiusAxis>
                                    </RadialBarChart>
                                </ChartContainer>

                                <div className="text-center mt-2">
                                    <div className="text-sm font-semibold" style={{ color: scoreColor }}>{scoreLabel}</div>
                                    <div className="text-xs text-zinc-500 mt-0.5">{answeredCount} of {totalQuestions} answered</div>
                                </div>

                                <div className="w-full h-px bg-zinc-100 my-4" />

                                <div className="w-full space-y-2 text-xs">
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Yes answers</span>
                                        <span className="font-medium text-emerald-600">
                                            {DISCOVERY_QUESTIONS.filter(q => (discoveryAnswers[q.key] || autoSuggestions[q.key]?.value) === "yes").length} x 10pts
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-zinc-600">
                                        <span>Unsure answers</span>
                                        <span className="font-medium text-amber-600">
                                            {DISCOVERY_QUESTIONS.filter(q => (discoveryAnswers[q.key] || autoSuggestions[q.key]?.value) === "unsure").length} x 5pts
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-zinc-600">
                                        <span>No answers</span>
                                        <span className="font-medium text-rose-600">
                                            {DISCOVERY_QUESTIONS.filter(q => (discoveryAnswers[q.key] || autoSuggestions[q.key]?.value) === "no").length} x 0pts
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full h-px bg-zinc-100 my-4" />

                                <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                                    Every &ldquo;no&rdquo; becomes a project in your 30/60/90 plan. Every &ldquo;yes&rdquo; is a foundation to build on.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ════════════════════════════ LIGHTBOX ════════════════════════════ */

function ZoomImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <img
                src={src}
                alt={alt}
                className={`${className || ""} cursor-zoom-in`}
                onClick={() => setOpen(true)}
            />
            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 cursor-zoom-out"
                    onClick={() => setOpen(false)}
                >
                    <img
                        src={src}
                        alt={alt}
                        className="max-w-full max-h-full rounded-xl shadow-2xl"
                    />
                    <button
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}
        </>
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
