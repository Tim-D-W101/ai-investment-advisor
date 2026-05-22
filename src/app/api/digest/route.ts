import { createAdminClient } from "@/lib/supabase/admin";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

interface Holding {
  ticker: string;
  name: string;
  units: number;
  avg_price: number;
}

interface Profile {
  user_id: string;
  profile_type: string;
  is_pro: boolean;
}

export async function POST(request: NextRequest) {
  const secret = request.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Fetch all Pro users with their profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("user_id, profile_type, is_pro")
    .eq("is_pro", true);

  if (profilesError) {
    return NextResponse.json({ error: profilesError.message }, { status: 500 });
  }

  const results: { user_id: string; status: string }[] = [];

  for (const profile of (profiles as Profile[]) ?? []) {
    // Get user email from auth.users
    const {
      data: { user },
    } = await supabase.auth.admin.getUserById(profile.user_id);
    if (!user?.email) continue;

    // Fetch holdings
    const { data: holdings } = await supabase
      .from("holdings")
      .select("ticker, name, units, avg_price")
      .eq("user_id", profile.user_id);

    const holdingsList = (holdings as Holding[]) ?? [];

    const holdingsHtml =
      holdingsList.length === 0
        ? "<p>No holdings tracked yet. <a href='https://investnow.vercel.app/portfolio'>Add your first holding →</a></p>"
        : `<table style="border-collapse:collapse;width:100%">
            <thead><tr>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #e1e5eb">Ticker</th>
              <th style="text-align:left;padding:8px;border-bottom:2px solid #e1e5eb">Name</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #e1e5eb">Units</th>
              <th style="text-align:right;padding:8px;border-bottom:2px solid #e1e5eb">Avg Price</th>
            </tr></thead>
            <tbody>
              ${holdingsList
                .map(
                  (h) => `<tr>
                <td style="padding:8px;border-bottom:1px solid #e1e5eb">${h.ticker}</td>
                <td style="padding:8px;border-bottom:1px solid #e1e5eb">${h.name}</td>
                <td style="text-align:right;padding:8px;border-bottom:1px solid #e1e5eb">${h.units}</td>
                <td style="text-align:right;padding:8px;border-bottom:1px solid #e1e5eb">R ${Number(h.avg_price).toLocaleString("en-ZA", { minimumFractionDigits: 2 })}</td>
              </tr>`
                )
                .join("")}
            </tbody>
          </table>`;

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;color:#1F4E79;max-width:600px;margin:0 auto;padding:24px">
  <h1 style="color:#1F4E79">Your weekly InvestNow digest</h1>
  <p>Hi there! Here's a summary of your <strong>${profile.profile_type}</strong> portfolio for the week.</p>
  <h2 style="margin-top:24px">Your holdings</h2>
  ${holdingsHtml}
  <p style="margin-top:24px">
    <a href="https://investnow.vercel.app/dashboard" style="background:#1F4E79;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">View dashboard →</a>
  </p>
  <hr style="margin-top:40px;border:none;border-top:1px solid #e1e5eb" />
  <p style="font-size:11px;color:#9ca3af">
    InvestNow provides educational information only — not regulated financial advice under the FAIS Act.
    <br />To unsubscribe, visit your <a href="https://investnow.vercel.app/settings">account settings</a>.
  </p>
</body>
</html>`;

    const { error: sendError } = await resend.emails.send({
      from: "InvestNow <digest@investnow.co.za>",
      to: user.email,
      subject: "Your weekly InvestNow portfolio digest",
      html,
    });

    results.push({
      user_id: profile.user_id,
      status: sendError ? `failed: ${sendError.message}` : "sent",
    });
  }

  return NextResponse.json({ sent: results.length, results });
}
