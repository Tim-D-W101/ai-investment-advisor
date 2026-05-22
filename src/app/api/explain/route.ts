import { explainStock } from "@/lib/claude";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as { ticker?: unknown };
    const ticker = body.ticker;

    if (!ticker || typeof ticker !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid ticker" },
        { status: 400 }
      );
    }

    const explanation = await explainStock(ticker.toUpperCase());
    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("/api/explain error:", err);
    return NextResponse.json(
      { error: "Failed to explain stock" },
      { status: 500 }
    );
  }
}
