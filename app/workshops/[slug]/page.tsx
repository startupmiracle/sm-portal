import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WorkshopPortal from "@/components/portal/WorkshopPortal";
import type { WorkshopLead } from "@/lib/skills/templates";

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: lead, error } = await supabase
    .from("leads_workshop")
    .select(
      "id, email, first_name, last_name, company_name, job_title, role, company_size, company_industry, business_task, ai_dream, ai_stage, enriched_data, recommendations, discovery_answers"
    )
    .ilike("email", user.email || "")
    .maybeSingle();

  if (error || !lead) {
    redirect("/workshops");
  }

  // Mark portal as visited
  await supabase
    .from("leads_workshop")
    .update({ portal_visited_at: new Date().toISOString() })
    .eq("id", lead.id);

  return <WorkshopPortal lead={lead as WorkshopLead} />;
}
