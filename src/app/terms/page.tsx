import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function TermsPage() {
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
        <h1 className="mb-2 text-2xl font-bold text-navy">Terms of Service</h1>
        <p className="mb-8 text-xs text-navy/40">Last updated: May 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-navy/70">
          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">1. Acceptance</h2>
            <p>By creating an account or using InvestNow, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the service.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">2. Educational service only</h2>
            <p>InvestNow provides educational information and portfolio tracking tools. We are NOT a licensed Financial Services Provider (FSP) under the FAIS Act. All content is educational — not regulated financial advice. See our Investment Disclaimer for full details.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">3. Eligibility</h2>
            <p>You must be at least 18 years old and legally able to enter into contracts in South Africa to use InvestNow.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">4. Account responsibility</h2>
            <p>You are responsible for keeping your login credentials secure. You are responsible for all activity that occurs under your account.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">5. Acceptable use</h2>
            <p>You may not use InvestNow to: (a) violate any law; (b) scrape, reverse-engineer, or copy the service; (c) attempt to gain unauthorised access to other users&apos; data; or (d) use the service for commercial redistribution without written permission.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">6. Limitation of liability</h2>
            <p>InvestNow is provided &quot;as is.&quot; To the maximum extent permitted by law, we are not liable for any investment losses, data loss, or indirect damages arising from your use of the service.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">7. Termination</h2>
            <p>We may suspend or terminate your account if you breach these terms. You may delete your account at any time by contacting support@investnow.app.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">8. Governing law</h2>
            <p>These terms are governed by the laws of the Republic of South Africa. Any disputes will be resolved in South African courts.</p>
          </section>

          <section>
            <h2 className="mb-2 text-base font-semibold text-navy">9. Changes</h2>
            <p>We may update these terms from time to time. Continued use after changes constitutes acceptance of the updated terms.</p>
          </section>
        </div>

        <div className="mt-8 flex gap-4 text-sm">
          <Link href="/privacy" className="text-navy/60 hover:text-navy">Privacy Policy</Link>
          <Link href="/disclaimer" className="text-navy/60 hover:text-navy">Investment Disclaimer</Link>
          <Link href="/" className="text-navy/60 hover:text-navy">Back to home</Link>
        </div>
      </main>
    </div>
  );
}
