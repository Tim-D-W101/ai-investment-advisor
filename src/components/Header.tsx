"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/browser";
import { LogOut, Menu, X, BarChart3 } from "lucide-react";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/explore", label: "Explore" },
  { href: "/settings", label: "Settings" },
];

export default function Header() {
  const [session, setSession] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const supabase = useMemo(() => createClient(), []);
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setSession(data.user !== null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session !== null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
  };

  return (
    <header className="border-b border-grey bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-navy" />
          <span className="text-xl font-semibold tracking-tight text-navy">
            InvestNow
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 sm:flex">
          {session &&
            NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-navy"
                    : "text-navy/60 hover:text-navy"
                }`}
              >
                {label}
              </Link>
            ))}
          {session ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-grey px-4 py-2 text-sm font-medium text-navy/70 transition-colors hover:bg-grey-soft hover:text-navy"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-navy px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-navy-light"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 sm:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? (
            <X className="h-6 w-6 text-navy" />
          ) : (
            <Menu className="h-6 w-6 text-navy" />
          )}
        </button>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <div className="border-t border-grey px-4 pb-4 pt-2 sm:hidden">
          <nav className="flex flex-col gap-3">
            {session &&
              NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm font-medium ${
                    pathname === href
                      ? "text-navy"
                      : "text-navy/70 hover:text-navy"
                  }`}
                >
                  {label}
                </Link>
              ))}
            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-navy/70 hover:text-navy"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-navy/70 hover:text-navy"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
