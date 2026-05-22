import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";

  const expected = crypto
    .createHmac("sha512", PAYSTACK_SECRET)
    .update(body)
    .digest("hex");

  if (signature !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(body) as {
    event: string;
    data: {
      metadata?: { user_id?: string };
      customer: { customer_code: string };
      status: string;
    };
  };

  if (event.event === "charge.success") {
    const userId = event.data.metadata?.user_id;
    if (userId) {
      const supabase = createAdminClient();
      await supabase
        .from("profiles")
        .update({
          is_pro: true,
          paystack_customer_code: event.data.customer.customer_code,
        })
        .eq("user_id", userId);
    }
  }

  return NextResponse.json({ received: true });
}
