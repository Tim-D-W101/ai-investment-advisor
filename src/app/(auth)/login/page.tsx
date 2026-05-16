"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { BarChart3, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-xl border border-grey bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-navy" />
            <span className="text-lg font-semibold text-navy">InvestNow</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-navy">Welcome back</h1>
          <p className="mt-1 text-sm text-navy/50">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4" noValidate>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-navy/70"
            >
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-dark" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "login-error" : undefined}
                className="w-full rounded-lg border border-grey py-2.5 pl-10 pr-3 text-sm text-navy placeholder:text-grey-dark focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-navy/70"
            >
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-grey-dark" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                aria-invalid={error ? "true" : undefined}
                aria-describedby={error ? "login-error" : undefined}
                className="w-full rounded-lg border border-grey py-2.5 pl-10 pr-10 text-sm text-navy placeholder:text-grey-dark focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-grey-dark hover:text-navy"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div
              id="login-error"
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-navy py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-navy/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-navy hover:text-navy-light"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
