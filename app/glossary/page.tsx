import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const SM_LOGO_URL =
  "https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png";

type Term = { term: string; definition: string; category: string };

const GLOSSARY: Term[] = [
  { term: "AI (Artificial Intelligence)", definition: "Software that can learn, reason, and make decisions. Claude, ChatGPT, and Gemini are AI assistants you can talk to in plain English.", category: "AI Basics" },
  { term: "Workflow Automation", definition: "Making repetitive tasks run automatically. Example: when a new lead fills your form, AI sends a welcome email, creates a CRM record, and notifies you on Slack — no human clicking required.", category: "AI Basics" },
  { term: "AI Credits", definition: "The currency you spend when using AI tools. Each question or task costs a small number of credits. Like cell phone minutes, but for AI.", category: "AI Basics" },
  { term: "Tokens", definition: "How AI measures text. Roughly 1 token = 1 word. When you send a message and get a response, both cost tokens. A 1,000-word document is about 750 tokens.", category: "AI Basics" },
  { term: "Tokenomics", definition: "The pricing math behind AI usage. Understanding how many tokens your tasks use helps you budget your AI spend.", category: "AI Basics" },
  { term: "MCP (Model Context Protocol)", definition: "A standard that lets AI tools connect to your apps (Gmail, Slack, CRM). Think of it as a universal adapter — plug it in and Claude can read your data.", category: "AI Basics" },
  { term: "API (Application Programming Interface)", definition: "A way for two apps to talk to each other. When your website sends form data to your CRM automatically, that's an API at work.", category: "Technical" },
  { term: "API Key", definition: "A password that lets one app access another. Like a hotel key card — it only opens the doors you're authorized to use.", category: "Technical" },
  { term: "Cron Job", definition: "A scheduled task that runs automatically at set times. Example: every Monday at 9am, generate a weekly report and email it to you.", category: "Technical" },
  { term: "MD File (Markdown)", definition: "A simple text format that uses symbols for formatting. # = heading, **bold**, - = bullet. Claude skills are .md files.", category: "Technical" },
  { term: "TXT File", definition: "Plain text file with no formatting. The simplest file type — just words, no styling.", category: "Technical" },
  { term: "HTML", definition: "The language of web pages. Every website you visit is HTML behind the scenes. It tells the browser what to show.", category: "Technical" },
  { term: "Next.js", definition: "A framework for building fast, modern websites. It's what portal.startupmiracle.com is built on. Think of it as the engine inside the car.", category: "Technical" },
  { term: "React", definition: "A way to build interactive web interfaces. Buttons, forms, tabs — all the things you click on. Next.js is built on top of React.", category: "Technical" },
  { term: "TypeScript", definition: "A stricter version of JavaScript (the language of the web). It catches errors before they reach your users. Like spell-check for code.", category: "Technical" },
  { term: "Mobile Responsive", definition: "A website that looks good on phones, tablets, and desktops. The layout adjusts automatically to fit any screen size.", category: "Design" },
  { term: "UX/UI", definition: "UX = User Experience (how it feels to use). UI = User Interface (how it looks). Good UX means your customer finds what they need fast.", category: "Design" },
  { term: "Opt-In Form", definition: "A form where someone gives you permission to contact them. Name, email, maybe phone. 3 fields max — more fields = fewer signups.", category: "Marketing" },
  { term: "URL", definition: "A web address. portal.startupmiracle.com is a URL. Every page on the internet has one.", category: "Technical" },
  { term: "DNS Records", definition: "The internet's phone book. DNS translates domain names (startupmiracle.com) into server addresses. You edit DNS when connecting a domain to a host.", category: "Technical" },
  { term: "Database", definition: "Where your data lives. Customer names, emails, orders, notes — all stored in organized tables. Supabase is the database we recommend.", category: "Technical" },
  { term: "OAuth", definition: "\"Sign in with Google\" — that's OAuth. It lets you log into one app using your account from another, without sharing your password.", category: "Technical" },
];

const categories = [...new Set(GLOSSARY.map((t) => t.category))];

export default function GlossaryPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f5" }}>
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-3xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={SM_LOGO_URL} alt="Startup Miracle" width={32} height={32} className="rounded-lg" />
            <div className="text-sm font-semibold text-zinc-900">Workshop Portal</div>
          </div>
          <Link href="/workshops" className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl md:text-3xl font-semibold text-zinc-900" style={{ fontFamily: "var(--font-heading)" }}>
            Glossary
          </h1>
        </div>
        <p className="text-sm text-zinc-500 mb-8 max-w-xl">
          Plain-English definitions for every tech term you&apos;ll encounter in the workshop. No jargon left behind.
        </p>

        {categories.map((cat) => (
          <div key={cat} className="mb-8">
            <Badge className="bg-zinc-100 text-zinc-600 border-zinc-200 mb-4">{cat}</Badge>
            <div className="space-y-3">
              {GLOSSARY.filter((t) => t.category === cat).map((t) => (
                <Card key={t.term}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-zinc-900 text-sm">{t.term}</h3>
                    <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{t.definition}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <footer className="border-t border-zinc-200 mt-8 pt-6 text-center text-xs text-zinc-400">
          Powered by{" "}
          <a href="https://startupmiracle.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600">
            Startup Miracle
          </a>
        </footer>
      </main>
    </div>
  );
}
