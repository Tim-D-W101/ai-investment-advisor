import Link from "next/link";
import { BarChart3, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      {/* Navigation */}
      <header className="border-b border-grey">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-7 w-7 text-navy" />
            <span className="text-xl font-semibold tracking-tight text-navy">
              InvestNow
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col">
        <section className="flex flex-1 items-center justify-center px-4 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl lg:text-6xl">
              Investing made simple
              <br />
              <span className="text-navy-light">for South Africans</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-navy/60 sm:text-xl">
              Get an AI-powered portfolio in 2 minutes. No jargon. No advisor
              fees.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/signup"
                className="w-full rounded-lg bg-navy px-8 py-3.5 text-center text-base font-semibold text-white shadow-sm transition-all hover:bg-navy-light hover:shadow-md sm:w-auto"
              >
                Start investing today
              </Link>
              <Link
                href="/login"
                className="w-full rounded-lg border border-grey px-8 py-3.5 text-center text-base font-semibold text-navy transition-colors hover:bg-grey-soft sm:w-auto"
              >
                Sign in
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-grey bg-grey-soft/50 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-6 md:grid-cols-3 md:gap-8">
              <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
                <Zap className="h-8 w-8 text-navy" />
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  2-minute setup
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Answer a few quick questions and get a personalised portfolio
                  tailored to your goals.
                </p>
              </div>
              <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
                <BarChart3 className="h-8 w-8 text-navy" />
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  AI-powered
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Our algorithms analyse the market and optimise your
                  investments automatically.
                </p>
              </div>
              <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
                <ShieldCheck className="h-8 w-8 text-navy" />
                <h3 className="mt-4 text-lg font-semibold text-navy">
                  No hidden fees
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-navy/60">
                  Transparent pricing with zero advisor fees. What you see is
                  what you get.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-grey px-4 py-6">
          <div className="mx-auto max-w-7xl text-center text-xs text-navy/40">
            &copy; {new Date().getFullYear()} InvestNow. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}
