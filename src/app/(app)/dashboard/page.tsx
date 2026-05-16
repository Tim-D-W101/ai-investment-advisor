import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { BarChart3, Wallet, TrendingUp, Clock } from "lucide-react";
import CelebrationWrapper from "./CelebrationWrapper";

export const dynamic = "force-dynamic";

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

  return (
    <>
      {showCelebration && <CelebrationWrapper />}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-navy sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-navy/50">{user.email}</p>
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
            <p className="mt-3 text-2xl font-bold text-navy">R 0.00</p>
            <p className="mt-1 text-xs text-navy/40">
              Start building your portfolio
            </p>
          </div>

          <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-navy/10 p-2">
                <TrendingUp className="h-5 w-5 text-navy" />
              </div>
              <span className="text-sm font-medium text-navy/50">Return</span>
            </div>
            <p className="mt-3 text-2xl font-bold text-green-600">+0.00%</p>
            <p className="mt-1 text-xs text-navy/40">All time</p>
          </div>

          <div className="rounded-xl border border-grey bg-white p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-navy/10 p-2">
                <Clock className="h-5 w-5 text-navy" />
              </div>
              <span className="text-sm font-medium text-navy/50">
                Portfolio age
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-navy">0 days</p>
            <p className="mt-1 text-xs text-navy/40">
              Get started with your first investment
            </p>
          </div>
        </div>

        {/* Empty state */}
        <div className="mt-10 rounded-xl border-2 border-dashed border-grey bg-white p-12 text-center shadow-sm">
          <BarChart3 className="mx-auto h-12 w-12 text-grey-dark" />
          <h2 className="mt-4 text-lg font-semibold text-navy">
            No investments yet
          </h2>
          <p className="mt-2 text-sm text-navy/50">
            Your AI-powered portfolio will appear here once you make your first
            investment.
          </p>
          <button
            disabled
            className="mt-6 rounded-lg bg-navy/60 px-6 py-2.5 text-sm font-semibold text-white opacity-60"
          >
            Coming soon
          </button>
        </div>
      </div>
    </>
  );
}
