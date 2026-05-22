import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { User, RefreshCw, Shield } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("profile_type, age_range, horizon, monthly_amount, goal, risk_score, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-navy/50">Manage your account and profile.</p>
      </div>

      {/* Account */}
      <section className="mb-6 rounded-xl border border-grey bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-navy/10 p-2">
            <User className="h-4 w-4 text-navy" />
          </div>
          <h2 className="font-semibold text-navy">Account</h2>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-navy/50">Email</span>
            <span className="font-medium text-navy">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-navy/50">User ID</span>
            <span className="font-mono text-xs text-navy/40">{user.id.slice(0, 16)}…</span>
          </div>
        </div>
      </section>

      {/* Investor profile */}
      <section className="mb-6 rounded-xl border border-grey bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-navy/10 p-2">
              <Shield className="h-4 w-4 text-navy" />
            </div>
            <h2 className="font-semibold text-navy">Investor Profile</h2>
          </div>
          <Link
            href="/onboarding"
            className="flex items-center gap-1.5 rounded-lg border border-grey px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-grey-soft hover:text-navy"
          >
            <RefreshCw className="h-3 w-3" />
            Retake quiz
          </Link>
        </div>
        {profile ? (
          <div className="space-y-3 text-sm">
            {[
              ["Profile type", profile.profile_type],
              ["Age range", profile.age_range?.replace(/_/g, " ")],
              ["Investment horizon", profile.horizon?.replace(/_/g, " ")],
              ["Monthly amount", profile.monthly_amount?.replace(/_/g, " ")],
              ["Primary goal", profile.goal?.replace(/_/g, " ")],
              ["Risk score", `${profile.risk_score} / 25`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-navy/50">{label}</span>
                <span className="font-medium capitalize text-navy">{value}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-navy/50 mb-3">No profile yet.</p>
            <Link
              href="/onboarding"
              className="rounded-lg bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy-light"
            >
              Take the quiz
            </Link>
          </div>
        )}
      </section>

      {/* Legal */}
      <section className="rounded-xl border border-grey bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-navy">Legal</h2>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/privacy" className="text-navy/60 transition-colors hover:text-navy">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-navy/60 transition-colors hover:text-navy">
            Terms of Service
          </Link>
          <Link href="/disclaimer" className="text-navy/60 transition-colors hover:text-navy">
            Investment Disclaimer
          </Link>
        </div>
      </section>
    </div>
  );
}
