import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  ctx: RouteContext<"/api/holdings/[id]">
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const { error } = await supabase
    .from("holdings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id); // ensure user owns the holding

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
