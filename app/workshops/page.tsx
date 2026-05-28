import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, LogOut, Calendar, Users, Building2 } from "lucide-react";

const SM_LOGO_URL =
  "https://res.cloudinary.com/dy7cv4bih/image/upload/v1756175129/SM_-_logo-icon-transp_fhdqbi.png";

const WORKSHOP_NAMES: Record<string, { name: string; partner: string }> = {
  "claude-smb-area": { name: "Claude SMB Workshop", partner: "Area Centre" },
};

export default async function WorkshopsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: leads } = await supabase
    .from("leads_workshop")
    .select("id, first_name, last_name, company_name, workshop_slug, created_at, ai_stage, source")
    .ilike("email", user?.email || "");

  const firstName = leads?.[0]?.first_name || user?.email?.split("@")[0] || "there";

  const workshops = leads?.length
    ? leads.map((lead) => {
        const slug = lead.workshop_slug || "claude-smb-area";
        const meta = WORKSHOP_NAMES[slug] || { name: "Workshop", partner: "" };
        return {
          slug,
          name: meta.name,
          partner: meta.partner,
          date: lead.created_at
            ? new Date(lead.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })
            : "",
          company: lead.company_name,
          aiStage: lead.ai_stage,
        };
      })
    : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#faf9f5" }}>
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={SM_LOGO_URL} alt="Startup Miracle" width={36} height={36} className="rounded-full" />
            <div>
              <div className="text-sm font-semibold text-zinc-900">Workshop Portal</div>
              <div className="text-xs text-zinc-500">Startup Miracle</div>
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

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Welcome back
          </Badge>
          <h1
            className="text-3xl font-semibold text-zinc-900 tracking-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Hey, {firstName}.
          </h1>
          <p className="mt-2 text-zinc-600">
            Here are the workshops you&apos;re enrolled in. Click one to access your personalized portal.
          </p>
        </div>

        {workshops.length === 0 ? (
          <Card className="border-dashed border-zinc-300">
            <CardContent className="py-12 text-center">
              <Users className="w-10 h-10 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500">
                No workshops found for {user?.email}. If you just registered, it
                may take a few minutes to appear.
              </p>
              <p className="text-xs text-zinc-400 mt-2">
                Questions? Email{" "}
                <a href="mailto:javier@startupmiracle.com" className="underline">
                  javier@startupmiracle.com
                </a>
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {workshops.map((w) => (
              <Link key={w.slug} href={`/workshops/${w.slug}`}>
                <Card className="border-zinc-200 hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{w.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {w.partner && `${w.partner} · `}{w.date}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Enrolled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                      {w.company && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5" />
                          {w.company}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {w.date}
                      </span>
                      {w.aiStage && (
                        <Badge variant="outline" className="text-xs">
                          {w.aiStage}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <footer className="border-t border-zinc-200 mt-12 pt-6 text-center text-xs text-zinc-400">
          Powered by{" "}
          <a href="https://startupmiracle.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600">
            Startup Miracle
          </a>
        </footer>
      </main>
    </div>
  );
}
