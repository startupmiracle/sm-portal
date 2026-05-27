import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { buildSkillMarkdown, SKILL_CATALOG, type SkillSlug, type WorkshopLead } from "@/lib/skills/templates";

const VALID_SLUGS = new Set(SKILL_CATALOG.map((s) => s.slug));

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    if (!VALID_SLUGS.has(slug as SkillSlug)) {
        return NextResponse.json({ error: "Unknown skill" }, { status: 404 });
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: lead, error } = await supabase
        .from("leads_workshop")
        .select(
            "id, email, first_name, last_name, company_name, job_title, role, company_size, company_industry, business_task, ai_dream, ai_stage, enriched_data, recommendations, discovery_answers"
        )
        .ilike("email", user.email || "")
        .maybeSingle();

    if (error || !lead) {
        return NextResponse.json({ error: "Workshop registration not found for this email" }, { status: 404 });
    }

    const markdown = buildSkillMarkdown(slug as SkillSlug, lead as WorkshopLead);

    return new NextResponse(markdown, {
        status: 200,
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Content-Disposition": `attachment; filename="${slug}.SKILL.md"`,
            "Cache-Control": "no-store",
        },
    });
}
