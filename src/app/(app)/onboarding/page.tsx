import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingQuiz from "./OnboardingQuiz";

export const dynamic = "force-dynamic";

export default async function OnboardingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // If user already has a profile, redirect to dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (profile) {
    redirect("/dashboard");
  }

  return <OnboardingQuiz />;
}
