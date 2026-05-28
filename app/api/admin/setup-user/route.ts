import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  // Try to create user; if they exist, update their password
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (createErr?.message?.includes("already been registered")) {
    // User exists — list users to find them, then update password
    const { data: list } = await supabase.auth.admin.listUsers();
    const user = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error: updateErr } = await supabase.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
    });

    if (updateErr) return NextResponse.json({ error: updateErr.message }, { status: 500 });
    return NextResponse.json({ status: "password_updated", user_id: user.id });
  }

  if (createErr) return NextResponse.json({ error: createErr.message }, { status: 500 });
  return NextResponse.json({ status: "created", user_id: created.user.id });
}
