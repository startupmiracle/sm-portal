import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const secret = request.headers.get("x-admin-secret");
  if (secret !== process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-8)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const supabase = await createServiceClient();
  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: {
      redirectTo: "https://portal.startupmiracle.com/auth/callback",
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    link: data.properties?.action_link,
    hashed_token: data.properties?.hashed_token,
  });
}
