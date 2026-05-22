import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-grey">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-navy" />
            <span className="font-semibold text-navy">InvestNow</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="mb-2 text-2xl font-bold text-navy">Privacy Policy</h1>
        <p className="mb-8 text-xs text-navy/40">Last updated: May 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-navy/70">
          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">1. What we collect</h2>
            <p>We collect your email address, quiz answers (risk profile), and portfolio data (tickers, units, prices) that you voluntarily provide.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">2. How we use it</h2>
            <p>Your data is used solely to generate personalised portfolio guidance, track your holdings, and send you account-related emails. We do not sell your personal data to third parties.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">3. Data storage</h2>
            <p>Data is stored securely in Supabase (Postgres) hosted in the EU. Authentication is handled by Supabase Auth. Row-level security ensures only you can access your data.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">4. AI processing</h2>
            <p>Your investor profile (risk type, age range, goal, horizon) is sent to the Claude API by Anthropic to generate portfolio guidance. No personally identifiable information such as your name or email is included in AI prompts.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">5. Your rights (POPIA)</h2>
            <p>Under the Protection of Personal Information Act (POPIA), you have the right to access, correct, or delete your personal information. To exercise these rights, contact us at privacy@investnow.app.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">6. Cookies</h2>
            <p>We use HTTP-only session cookies for authentication. No tracking or advertising cookies are used.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">7. Contact</h2>
            <p>Questions about this policy? Email privacy@investnow.app.</p>
          </section>
        </div>

        <div className="mt-8 flex gap-4 text-sm">
          <Link href="/terms" className="text-navy/60 hover:text-navy">Terms of Service</Link>
          <Link href="/disclaimer" className="text-navy/60 hover:text-navy">Investment Disclaimer</Link>
          <Link href="/" className="text-navy/60 hover:text-navy">Back to home</Link>
        </div>
      </main>
    </div>
  );
}
