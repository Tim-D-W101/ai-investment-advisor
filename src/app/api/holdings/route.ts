import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("holdings")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    ticker?: unknown;
    name?: unknown;
    units?: unknown;
    avg_price?: unknown;
    purchase_date?: unknown;
  };

  const { ticker, name, units, avg_price, purchase_date } = body;

  if (
    typeof ticker !== "string" ||
    typeof name !== "string" ||
    typeof units !== "number" ||
    typeof avg_price !== "number"
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("holdings")
    .insert({
      user_id: user.id,
      ticker: ticker.toUpperCase(),
      name,
      units,
      avg_price,
      purchase_date: purchase_date ?? new Date().toISOString().split("T")[0],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
