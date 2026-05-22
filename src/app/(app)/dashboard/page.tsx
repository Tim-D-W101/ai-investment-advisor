import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, User } from "lucide-react";
import CelebrationWrapper from "./CelebrationWrapper";
import RecommendationPanel from "./RecommendationPanel";

export const dynamic = "force-dynamic";

const PROFILE_LABELS: Record<string, string> = {
  Conservative: "Conservative 🛡️",
  Balanced: "Balanced ⚖️",
  Aggressive: "Aggressive 🚀",
};

export default async function DashboardPage(props: {
  searchParams?: Promise<{ onboarded?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const searchParams = await props.searchParams;
  const showCelebration = searchParams?.onboarded === "true";

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("profile_type, monthly_amount, goal")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // If no profile yet, redirect to onboarding
  if (!profile) {
    redirect("/onboarding");
  }

  // Fetch holdings summary
  const { data: holdings } = await supabase
    .from("holdings")
    .select("units, avg_price")
    .eq("user_id", user.id);

  const totalInvested =
    holdings?.reduce((sum, h) => sum + h.units * h.avg_price, 0) ?? 0;

  return (
    <>
      {showCelebration && <CelebrationWrapper />}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-navy sm:text-3xl">
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-navy/50">{user.email}</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-navy/10 px-3 py-1 text-sm font-medium text-navy">
            {PROFILE_LABELS[profile.profile_type] ?? profile.profile_type}
          </span>
        </div>

        {/* Stats grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-navy/10 p-2">
                <Wallet className="h-5 w-5 text-navy" />
              </div>
              <span className="text-sm font-medium text-navy/50">
                Total invested
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-navy">
              R{" "}
              {totalInvested.toLocaleString("en-ZA", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="mt-1 text-xs text-navy/40">
              {holdings?.length
                ? `${holdings.length} holding${holdings.length === 1 ? "" : "s"} tracked`
                : "Start adding holdings in Portfolio"}
            </p>
          </div>

          <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-navy/10 p-2">
                <TrendingUp className="h-5 w-5 text-navy" />
              </div>
              <span className="text-sm font-medium text-navy/50">
                Monthly target
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-navy">
              {profile.monthly_amount?.replace(/_/g, " ") ?? "—"}
            </p>
            <p className="mt-1 text-xs text-navy/40">
              Based on your quiz answers
            </p>
          </div>

          <div className="rounded-xl border border-grey bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-navy/10 p-2">
                <User className="h-5 w-5 text-navy" />
              </div>
              <span className="text-sm font-medium text-navy/50">
                Investment goal
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold capitalize text-navy">
              {profile.goal?.replace(/_/g, " ") ?? "—"}
            </p>
            <p className="mt-1 text-xs text-navy/40">
              Retake quiz in Settings to update
            </p>
          </div>
        </div>

        {/* AI Recommendation Panel — client component */}
        <RecommendationPanel />
      </div>
    </>
  );
}
