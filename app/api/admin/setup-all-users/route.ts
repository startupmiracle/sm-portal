import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server";

export async function POST() {
  const supabase = await createServiceClient();

  // Get all participants
  const { data: leads, error: fetchErr } = await supabase
    .from("leads_workshop")
    .select("email, phone")
    .order("created_at", { ascending: true });

  if (fetchErr || !leads) {
    return NextResponse.json({ error: fetchErr?.message || "No leads" }, { status: 500 });
  }

  // Dedupe by email (lowercase)
  const seen = new Set<string>();
  const unique = leads.filter((l) => {
    const key = l.email.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const results: { email: string; status: string; password: string }[] = [];

  for (const lead of unique) {
    const email = lead.email.toLowerCase().trim();
    const digitsOnly = (lead.phone || "").replace(/\D/g, "");

    if (!digitsOnly || digitsOnly.length < 6) {
      results.push({ email, status: "skipped_short_phone", password: digitsOnly });
      continue;
    }

    // Try create; if exists, update password
    const { error: createErr } = await supabase.auth.admin.createUser({
      email,
      password: digitsOnly,
      email_confirm: true,
    });

    if (createErr?.message?.includes("already been registered")) {
      // Find and update
      const { data: list } = await supabase.auth.admin.listUsers();
      const user = list?.users?.find((u) => u.email?.toLowerCase() === email);
      if (user) {
        await supabase.auth.admin.updateUserById(user.id, {
          password: digitsOnly,
          email_confirm: true,
        });
        results.push({ email, status: "password_updated", password: digitsOnly });
      } else {
        results.push({ email, status: "user_not_found", password: digitsOnly });
      }
    } else if (createErr) {
      results.push({ email, status: `error: ${createErr.message}`, password: digitsOnly });
    } else {
      results.push({ email, status: "created", password: digitsOnly });
    }
  }

  return NextResponse.json({
    total: unique.length,
    created: results.filter((r) => r.status === "created").length,
    updated: results.filter((r) => r.status === "password_updated").length,
    errors: results.filter((r) => r.status.startsWith("error")).length,
    results,
  });
}
