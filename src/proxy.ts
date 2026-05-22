import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/onboarding",
  "/portfolio",
  "/explore",
  "/stock",
  "/settings",
];

export async function proxy(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request);
  const path = request.nextUrl.pathname;

  // Protect authenticated-only routes
  if (!user && PROTECTED_PREFIXES.some((p) => path.startsWith(p))) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", path);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (user && (path === "/login" || path === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
