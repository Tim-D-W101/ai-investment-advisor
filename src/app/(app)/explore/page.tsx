import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ExternalLink, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";

const FEATURED_STOCKS = [
  { ticker: "STX40", name: "Satrix Top 40 ETF", type: "ETF", exchange: "JSE", description: "Tracks the FTSE/JSE Top 40 index — the 40 largest companies on the JSE." },
  { ticker: "STXDIV", name: "Satrix Dividend Plus", type: "ETF", exchange: "JSE", description: "JSE ETF focused on high-dividend-yielding stocks." },
  { ticker: "STXWDM", name: "Satrix MSCI World ETF", type: "ETF", exchange: "JSE", description: "Gives you exposure to developed market equities globally in ZAR." },
  { ticker: "NPN.JO", name: "Naspers", type: "Stock", exchange: "JSE", description: "Africa's largest technology group and a major Tencent shareholder." },
  { ticker: "BHP.JO", name: "BHP Group", type: "Stock", exchange: "JSE", description: "Global mining giant producing iron ore, copper, coal, and oil." },
  { ticker: "AGL.JO", name: "Anglo American", type: "Stock", exchange: "JSE", description: "Diversified mining company with diamond, platinum, and copper operations." },
  { ticker: "SOL.JO", name: "Sasol", type: "Stock", exchange: "JSE", description: "Integrated energy and chemicals company, South Africa-based." },
  { ticker: "SBK.JO", name: "Standard Bank", type: "Stock", exchange: "JSE", description: "Africa's largest bank by assets, headquartered in Johannesburg." },
  { ticker: "FSR.JO", name: "FirstRand", type: "Stock", exchange: "JSE", description: "Financial services group that owns FNB, Rand Merchant Bank, and WesBank." },
  { ticker: "SHP.JO", name: "Shoprite", type: "Stock", exchange: "JSE", description: "Africa's largest food retailer with over 3,000 stores across the continent." },
  { ticker: "MTN.JO", name: "MTN Group", type: "Stock", exchange: "JSE", description: "Pan-African telecommunications company operating in 19 countries." },
  { ticker: "VOD.JO", name: "Vodacom", type: "Stock", exchange: "JSE", description: "South Africa's largest mobile network operator by subscribers." },
];

export default async function ExplorePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const etfs = FEATURED_STOCKS.filter((s) => s.type === "ETF");
  const stocks = FEATURED_STOCKS.filter((s) => s.type === "Stock");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy sm:text-3xl">
          Explore
        </h1>
        <p className="mt-1 text-sm text-navy/50">
          Browse popular JSE stocks and ETFs. Click any to get an AI explanation.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 rounded-lg border border-grey bg-grey-soft px-4 py-3 text-xs text-navy/50">
        The information below is educational only — not regulated financial advice. Always do your own research before investing.
      </div>

      <section className="mb-10">
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-navy">
          <TrendingUp className="h-4 w-4" />
          JSE ETFs
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {etfs.map((stock) => (
            <StockCard key={stock.ticker} {...stock} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 flex items-center gap-2 text-base font-semibold text-navy">
          <TrendingUp className="h-4 w-4" />
          JSE Blue-chip Stocks
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stocks.map((stock) => (
            <StockCard key={stock.ticker} {...stock} />
          ))}
        </div>
      </section>
    </div>
  );
}

function StockCard({
  ticker,
  name,
  type,
  exchange,
  description,
}: {
  ticker: string;
  name: string;
  type: string;
  exchange: string;
  description: string;
}) {
  return (
    <Link
      href={`/stock/${encodeURIComponent(ticker)}`}
      className="group rounded-xl border border-grey bg-white p-5 shadow-sm transition-all hover:border-navy-light hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="font-semibold text-navy group-hover:text-navy-light">
            {ticker}
          </span>
          <p className="mt-0.5 text-xs text-navy/50">{name}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded bg-grey-soft px-1.5 py-0.5 text-xs text-navy/50">
            {type}
          </span>
          <span className="rounded bg-navy/10 px-1.5 py-0.5 text-xs font-medium text-navy">
            {exchange}
          </span>
          <ExternalLink className="h-3.5 w-3.5 text-navy/30 group-hover:text-navy-light" />
        </div>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-navy/60">{description}</p>
    </Link>
  );
}
