import { createClient } from "@/lib/supabase/server";
import { getPortfolioRecommendation } from "@/lib/claude";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user's latest profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: "Profile not found. Complete the onboarding quiz first." },
        { status: 404 }
      );
    }

    // Return cached recommendation if one exists
    const { data: existing } = await supabase
      .from("recommendations")
      .select("portfolio_json")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existing?.portfolio_json) {
      return NextResponse.json(existing.portfolio_json);
    }

    // Generate a new recommendation via Claude
    const recommendation = await getPortfolioRecommendation({
      profile_type: profile.profile_type,
      age_range: profile.age_range,
      horizon: profile.horizon,
      monthly_amount: profile.monthly_amount,
      goal: profile.goal,
    });

    // Persist the recommendation
    await supabase.from("recommendations").insert({
      user_id: user.id,
      portfolio_json: recommendation,
    });

    return NextResponse.json(recommendation);
  } catch (err) {
    console.error("/api/recommend error:", err);
    return NextResponse.json(
      { error: "Failed to generate recommendation" },
      { status: 500 }
    );
  }
}

// Allow forcing a fresh recommendation
export async function DELETE() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await supabase.from("recommendations").delete().eq("user_id", user.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("/api/recommend DELETE error:", err);
    return NextResponse.json({ error: "Failed to clear" }, { status: 500 });
  }
}
