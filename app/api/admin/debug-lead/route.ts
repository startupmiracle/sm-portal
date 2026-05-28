import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const email = searchParams.get("email");

  const supabase = await createServiceClient();

  let query = supabase.from("leads_workshop").select("*");
  if (id) query = query.eq("id", id);
  if (email) query = query.ilike("email", email);

  const { data, error } = await query.limit(5);

  return NextResponse.json({ data, error, count: data?.length });
}
