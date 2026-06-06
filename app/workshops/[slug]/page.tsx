import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import WorkshopPortal from "@/components/portal/WorkshopPortal";
import type { WorkshopLead } from "@/lib/skills/templates";
import { getWorkshop, DEFAULT_WORKSHOP_SLUG } from "@/lib/workshops";

export default async function WorkshopDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Workshops that haven't launched yet are preview-only — no classroom access.
  if (getWorkshop(slug).comingSoon) {
    redirect("/workshops");
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // One email can be enrolled in multiple workshops — pick the row for THIS slug.
  const { data: leads } = await supabase
    .from("leads_workshop")
    .select("*")
    .ilike("email", user.email || "")
    .order("created_at", { ascending: false });

  const lead = (leads || []).find(
    (l) => (l.workshop_slug || DEFAULT_WORKSHOP_SLUG) === slug
  );

  if (!lead) {
    redirect("/workshops");
  }

  // Mark portal as visited
  await supabase
    .from("leads_workshop")
    .update({ portal_visited_at: new Date().toISOString() })
    .eq("id", lead.id);

  // Map the flat enrichment columns into the enriched_data object for the portal
  const enrichedLead: WorkshopLead = {
    id: lead.id,
    email: lead.email,
    first_name: lead.first_name,
    last_name: lead.last_name,
    company_name: lead.company_name,
    job_title: lead.job_title,
    role: lead.role,
    company_size: lead.company_size,
    company_industry: lead.company_industry,
    business_task: lead.business_task,
    ai_dream: lead.ai_dream,
    ai_stage: lead.ai_stage,
    discovery_answers: lead.discovery_answers || {},
    recommendations: lead.recommendations || {},
    enriched_data: {
      person_bio: lead.person_bio,
      company_description: lead.company_description,
      services: lead.services,
      ideal_customers: lead.ideal_customers,
      marketing_angle: lead.marketing_angle,
      website_url: lead.website_url,
      website_status: lead.website_status,
      website_analysis: lead.website_analysis,
      website_screenshot_url: lead.website_screenshot_url,
      linkedin_url: lead.linkedin_url,
      twitter_url: lead.twitter_url,
      instagram_url: lead.instagram_url,
      facebook_url: lead.facebook_url,
      youtube_url: lead.youtube_url,
      ai_recommendations: lead.ai_recommendations,
      lead_score: lead.lead_score,
      enrichment_status: lead.enrichment_status,
      enriched_at: lead.enriched_at,
    },
  };

  return <WorkshopPortal lead={enrichedLead} slug={slug} />;
}
