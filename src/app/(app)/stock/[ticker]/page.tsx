import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import StockExplainer from "./StockExplainer";

export const dynamic = "force-dynamic";

export default async function StockPage({
  params,
}: {
  params: Promise<{ ticker: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { ticker } = await params;
  const decodedTicker = decodeURIComponent(ticker).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/explore"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-navy/60 transition-colors hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-navy">{decodedTicker}</h1>
        <p className="mt-1 text-sm text-navy/50">
          AI-generated plain-language explanation
        </p>
      </div>

      <div className="mb-4 flex items-start gap-2 rounded-lg border border-grey bg-grey-soft px-4 py-3 text-xs text-navy/50">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This explanation is for educational purposes only — not regulated
        financial advice. We are not an FSP-licensed entity. Always conduct your
        own research before investing.
      </div>

      <StockExplainer ticker={decodedTicker} />
    </div>
  );
}
