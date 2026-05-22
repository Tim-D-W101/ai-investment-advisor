import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;

export async function GET(request: NextRequest) {
  const reference = request.nextUrl.searchParams.get("reference");
  if (!reference) {
    return NextResponse.redirect(new URL("/pricing?payment=failed", request.url));
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` },
  });

  if (!res.ok) {
    return NextResponse.redirect(new URL("/pricing?payment=failed", request.url));
  }

  const json = (await res.json()) as {
    data: {
      status: string;
      metadata: { user_id?: string };
      customer: { customer_code: string };
    };
  };

  if (json.data.status !== "success") {
    return NextResponse.redirect(new URL("/pricing?payment=failed", request.url));
  }

  const userId = json.data.metadata?.user_id;
  if (userId) {
    const supabase = createAdminClient();
    await supabase
      .from("profiles")
      .update({
        is_pro: true,
        paystack_customer_code: json.data.customer.customer_code,
      })
      .eq("user_id", userId);
  }

  return NextResponse.redirect(new URL("/dashboard?payment=success", request.url));
}
