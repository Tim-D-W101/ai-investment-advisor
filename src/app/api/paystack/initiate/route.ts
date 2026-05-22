import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: user.email,
      amount: 14900, // R149.00 in cents
      currency: "ZAR",
      callback_url: `${APP_URL}/api/paystack/callback`,
      metadata: { user_id: user.id },
      plan: process.env.PAYSTACK_PLAN_CODE, // optional: recurring plan code
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 502 });
  }

  const json = (await res.json()) as { data: { authorization_url: string } };
  return NextResponse.json({ url: json.data.authorization_url });
}
