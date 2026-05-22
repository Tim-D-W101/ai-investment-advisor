"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles, RefreshCw } from "lucide-react";

export default function StockExplainer({ ticker }: { ticker: string }) {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticker }),
    })
      .then(async (res) => {
        const body = (await res.json()) as {
          explanation?: string;
          error?: string;
        };
        if (!res.ok) {
          setError(body.error ?? "Failed to load explanation");
        } else {
          setExplanation(body.explanation ?? null);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, [ticker]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <div className="rounded-xl border border-grey bg-white p-8">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 animate-pulse text-navy" />
          <span className="text-sm text-navy/60">
            Asking Claude to explain {ticker}…
          </span>
        </div>
        <div className="mt-5 space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 animate-pulse rounded bg-grey-soft"
              style={{ width: `${85 - i * 10}%` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-grey bg-white p-8 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => void load()}
          className="mt-4 flex items-center gap-1.5 mx-auto rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-grey bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-navy" />
        <span className="text-sm font-semibold text-navy">
          Claude&apos;s explanation
        </span>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed text-navy/80">
        {explanation}
      </p>
      <button
        onClick={() => void load()}
        className="mt-5 flex items-center gap-1.5 text-xs font-medium text-navy/50 transition-colors hover:text-navy"
      >
        <RefreshCw className="h-3 w-3" />
        Regenerate
      </button>
    </div>
  );
}
