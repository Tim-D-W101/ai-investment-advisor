import Link from "next/link";
import { Check, BarChart3 } from "lucide-react";
import PaystackButton from "@/components/PaystackButton";

const FREE_FEATURES = [
  "5-question investor quiz",
  "Basic AI portfolio guidance",
  "Manual portfolio tracking",
  "Explore JSE stocks & ETFs",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Live price fetching (15-min delay)",
  "Weekly AI portfolio digest email",
  "Unlimited AI stock explanations",
  "Gain/loss performance tracking",
  "Priority support",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-grey-soft">
      {/* Nav */}
      <header className="border-b border-grey bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-navy" />
            <span className="text-xl font-semibold tracking-tight text-navy">
              InvestNow
            </span>
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light"
          >
            Get started free
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-navy sm:text-4xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-4 text-navy/60">
            Start free. Upgrade when you&apos;re ready.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {/* Free tier */}
          <div className="rounded-2xl border border-grey bg-white p-8 shadow-sm">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-navy">Free</h2>
              <div className="mt-2">
                <span className="text-4xl font-bold text-navy">R 0</span>
                <span className="ml-1 text-sm text-navy/50">/ month</span>
              </div>
              <p className="mt-2 text-sm text-navy/50">
                Everything you need to get started investing.
              </p>
            </div>
            <Link
              href="/signup"
              className="block w-full rounded-lg border border-navy px-6 py-3 text-center text-sm font-semibold text-navy transition-colors hover:bg-navy hover:text-white"
            >
              Start for free
            </Link>
            <ul className="mt-8 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-navy/70">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div className="rounded-2xl border-2 border-navy bg-navy p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-white">Pro</h2>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
                  14-day free trial
                </span>
              </div>
              <div className="mt-2">
                <span className="text-4xl font-bold text-white">R 149</span>
                <span className="ml-1 text-sm text-white/60">/ month</span>
              </div>
              <p className="mt-1 text-xs text-white/50">
                or R 1,490 / year — save 17%
              </p>
              <p className="mt-2 text-sm text-white/70">
                For serious investors who want more.
              </p>
            </div>
            <PaystackButton />
            <ul className="mt-8 space-y-3">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-white/80">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-12 text-center text-xs text-navy/40">
          InvestNow provides educational information only — not regulated financial advice. We are not an
          FSP-licensed entity under the FAIS Act. Prices exclude VAT where applicable.
        </p>
      </main>
    </div>
  );
}
