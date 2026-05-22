import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import PortfolioTracker from "./PortfolioTracker";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: holdings } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">
          My Portfolio
        </h1>
        <p className="mt-1 text-sm text-navy/50">
          Track your holdings, monitor performance, and log new investments.
        </p>
      </div>
      <PortfolioTracker initialHoldings={holdings ?? []} />
    </div>
  );
}
