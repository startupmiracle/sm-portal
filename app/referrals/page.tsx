import ReferralsPageClient from "./ReferralsPageClient";

/** Auth gate is in utils/supabase/proxy.ts — registered users only. */
export const dynamic = "force-dynamic";

export default function ReferralsPage() {
  return <ReferralsPageClient />;
}
