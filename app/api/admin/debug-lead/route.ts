import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("leads_workshop")
    .select("discovery_answers, ai_recommendations, linkedin_url, twitter_url, instagram_url, facebook_url, youtube_url")
    .eq("id", id || "")
    .maybeSingle();

  return NextResponse.json({ data, error });
}
