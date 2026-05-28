import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createServiceClient();
  const { data, error } = await supabase
    .from("leads_workshop")
    .select("id, email, first_name, last_name, phone, workshop_slug")
    .order("created_at", { ascending: true });

  const summary = {
    total: data?.length || 0,
    with_phone: data?.filter((d) => d.phone && d.phone.trim().length > 0).length || 0,
    without_phone: data?.filter((d) => !d.phone || d.phone.trim().length === 0).length || 0,
    participants: data?.map((d) => ({
      name: `${d.first_name || ""} ${d.last_name || ""}`.trim(),
      email: d.email,
      phone: d.phone || null,
      has_phone: !!(d.phone && d.phone.trim().length > 0),
      workshop: d.workshop_slug,
    })),
  };

  return NextResponse.json(summary);
}
