import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Calendar, Users, Building2, Clock } from "lucide-react";
import { getWorkshop, WORKSHOPS, DEFAULT_WORKSHOP_SLUG } from "@/lib/workshops";
import { PortalShell } from "@/components/portal/PortalShell";

type WorkshopCardData = {
  slug: string;
  name: string;
  partner: string;
  image: string;
  date: string;
  company?: string | null;
  aiStage?: string | null;
  comingSoon: boolean;
};

function formatDate(value: string | null | undefined): string {
  return value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";
}

function WorkshopCardItem({ w }: { w: WorkshopCardData }) {
  const card = (
    <Card
      className={`border-zinc-200 overflow-hidden transition-all ${
        w.comingSoon
          ? "opacity-95"
          : "hover:border-emerald-200 hover:shadow-md cursor-pointer"
      }`}
    >
      <div className="flex flex-col sm:flex-row">
        {w.image && (
          <div className="sm:w-48 sm:flex-shrink-0 relative">
            <Image
              src={w.image}
              alt={w.name}
              width={192}
              height={192}
              className={`w-full h-40 sm:h-full object-cover ${w.comingSoon ? "grayscale-[35%]" : ""}`}
            />
          </div>
        )}
        <div className="flex-1">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">{w.name}</CardTitle>
                <CardDescription className="mt-1">
                  {w.partner && `${w.partner}`}
                  {w.partner && w.date && " · "}
                  {w.date}
                </CardDescription>
              </div>
              {w.comingSoon ? (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200 whitespace-nowrap">
                  <Clock className="w-3 h-3 mr-1" />
                  Coming Soon
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Enrolled
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {w.comingSoon ? (
              <p className="text-sm text-zinc-500">
                Opening soon — you&apos;ll get access from this page when it goes live.
              </p>
            ) : (
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
            )}
          </CardContent>
        </div>
      </div>
    </Card>
  );

  if (w.comingSoon) {
    return <div className="cursor-default select-none">{card}</div>;
  }

  return <Link href={`/workshops/${w.slug}`}>{card}</Link>;
}

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

  const enrolled: WorkshopCardData[] = (leads || []).map((lead) => {
    const slug = lead.workshop_slug || DEFAULT_WORKSHOP_SLUG;
    const meta = getWorkshop(slug);
    return {
      slug,
      name: meta.name,
      partner: meta.partner,
      image: meta.image,
      date: formatDate(lead.created_at),
      company: lead.company_name,
      aiStage: lead.ai_stage,
      comingSoon: meta.comingSoon,
    };
  });

  const enrolledSlugs = new Set(enrolled.map((w) => w.slug));
  const isClaudeEnrolled = enrolledSlugs.has("claude-smb-area");

  // Claude SMB attendees get a preview of upcoming (not-yet-launched) workshops.
  const upcoming: WorkshopCardData[] = isClaudeEnrolled
    ? Object.values(WORKSHOPS)
        .filter((w) => w.comingSoon && !enrolledSlugs.has(w.slug))
        .map((w) => ({
          slug: w.slug,
          name: w.name,
          partner: w.partner,
          image: w.image,
          date: "",
          comingSoon: true,
        }))
    : [];

  return (
    <PortalShell title="Customer Portal" subtitle="Workshops">
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

      {enrolled.length === 0 ? (
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
          {enrolled.map((w) => (
            <WorkshopCardItem key={w.slug} w={w} />
          ))}
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold text-zinc-900">Upcoming Workshops</h2>
            <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
              New
            </Badge>
          </div>
          <p className="text-sm text-zinc-500 mb-4 -mt-1">
            A preview of what&apos;s next. These open up here over the coming days.
          </p>
          <div className="grid gap-4">
            {upcoming.map((w) => (
              <WorkshopCardItem key={w.slug} w={w} />
            ))}
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-200 mt-12 pt-6 text-center text-xs text-zinc-400">
        Powered by{" "}
        <a href="https://startupmiracle.com" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-600">
          Startup Miracle
        </a>
      </footer>
    </PortalShell>
  );
}
