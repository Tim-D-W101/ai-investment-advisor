"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type ProfileData = {
  age_range: string;
  horizon: string;
  monthly_amount: string;
  risk_reaction: string;
  goal: string;
  risk_score: number;
  profile_type: string;
};

export async function saveProfile(data: ProfileData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { error } = await supabase.from("profiles").insert({
    user_id: user.id,
    age_range: data.age_range,
    horizon: data.horizon,
    monthly_amount: data.monthly_amount,
    risk_reaction: data.risk_reaction,
    goal: data.goal,
    risk_score: data.risk_score,
    profile_type: data.profile_type,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Failed to save profile:", error);
    throw new Error(error.message);
  }

  redirect("/dashboard?onboarded=true");
}
