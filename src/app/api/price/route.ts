import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// 15-minute in-memory price cache
const priceCache = new Map<string, { price: number; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000;

type AlphaVantageQuote = {
  "01. symbol": string;
  "05. price": string;
  "09. change": string;
  "10. change percent": string;
};

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json({ error: "Missing ticker" }, { status: 400 });
    }

    // Return cached price if still fresh
    const cached = priceCache.get(ticker);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({ ticker, price: cached.price, cached: true });
    }

    const apiKey = process.env.ALPHA_VANTAGE_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Price service not configured" },
        { status: 503 }
      );
    }

    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(ticker)}&apikey=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = (await res.json()) as Record<string, unknown>;

    const quote = data["Global Quote"] as AlphaVantageQuote | undefined;
    if (!quote || !quote["05. price"]) {
      return NextResponse.json(
        { error: "Price not found for ticker", ticker },
        { status: 404 }
      );
    }

    const price = parseFloat(quote["05. price"]);
    const change = parseFloat(quote["09. change"] ?? "0");
    const changePercent = quote["10. change percent"]?.replace("%", "") ?? "0";

    priceCache.set(ticker, { price, timestamp: Date.now() });

    return NextResponse.json({
      ticker,
      price,
      change,
      changePercent: parseFloat(changePercent),
    });
  } catch (err) {
    console.error("/api/price error:", err);
    return NextResponse.json(
      { error: "Failed to fetch price" },
      { status: 500 }
    );
  }
}
