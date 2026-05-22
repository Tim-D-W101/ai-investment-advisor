"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Sparkles, RefreshCw, ChevronDown, ChevronUp, Info } from "lucide-react";

type Holding = {
  ticker: string;
  name: string;
  type: string;
  allocation_percent: number;
  reasoning: string;
};

type Recommendation = {
  portfolio: Holding[];
  summary: string;
};

const CHART_COLOURS = [
  "#1F4E79",
  "#2a6aa8",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
  "#dbeafe",
  "#e0f2fe",
];

export default function RecommendationPanel() {
  const [data, setData] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [explaining, setExplaining] = useState<string | null>(null);
  const [explanations, setExplanations] = useState<Record<string, string>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendation = useCallback(() => {
    fetch("/api/recommend", { method: "POST" })
      .then(async (res) => {
        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          setError(body.error ?? "Failed to load recommendation");
        } else {
          setData((await res.json()) as Recommendation);
        }
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Something went wrong");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchRecommendation();
  }, [fetchRecommendation]);

  const handleRefresh = () => {
    setRefreshing(true);
    setData(null);
    setError(null);
    setExplanations({});
    setLoading(true);
    fetch("/api/recommend", { method: "DELETE" }).finally(() => {
      setRefreshing(false);
      fetchRecommendation();
    });
  };

  const handleExplain = async (ticker: string) => {
    if (explanations[ticker]) {
      setExpanded(expanded === ticker ? null : ticker);
      return;
    }
    setExplaining(ticker);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker }),
      });
      const body = (await res.json()) as { explanation?: string };
      setExplanations((prev) => ({
        ...prev,
        [ticker]: body.explanation ?? "No explanation available.",
      }));
      setExpanded(ticker);
    } catch {
      setExplanations((prev) => ({
        ...prev,
        [ticker]: "Could not load explanation. Please try again.",
      }));
    } finally {
      setExplaining(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-10 rounded-xl border border-grey bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 animate-pulse text-navy" />
          <span className="text-sm font-medium text-navy/60">
            Generating your personalised portfolio…
          </span>
        </div>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-lg bg-grey-soft" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-10 rounded-xl border border-grey bg-white p-8 text-center shadow-sm">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => void fetchRecommendation()}
          className="mt-4 rounded-lg bg-navy px-5 py-2 text-sm font-medium text-white hover:bg-navy-light"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!data) return null;

  const chartData = data.portfolio.map((h) => ({
    name: h.ticker,
    value: h.allocation_percent,
  }));

  return (
    <div className="mt-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-navy" />
          <h2 className="text-lg font-semibold text-navy">
            Your AI Portfolio Guidance
          </h2>
        </div>
        <button
          onClick={() => void handleRefresh()}
          disabled={refreshing}
          title="Regenerate recommendation"
          className="flex items-center gap-1.5 rounded-lg border border-grey px-3 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-grey-soft hover:text-navy disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <p className="rounded-lg bg-navy/5 px-4 py-3 text-sm leading-relaxed text-navy/70">
        {data.summary}
      </p>

      {/* Disclaimer */}
      <p className="flex items-start gap-2 text-xs text-navy/40">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        This is educational information only — not regulated financial advice. We
        are not an FSP-licensed entity. Always do your own research before
        investing.
      </p>

      {/* Pie chart + holdings grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Chart */}
        <div className="rounded-xl border border-grey bg-white p-4 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-navy">
            Suggested allocation
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLOURS[index % CHART_COLOURS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-navy/70">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Holdings list */}
        <div className="space-y-3">
          {data.portfolio.map((holding, i) => (
            <div
              key={holding.ticker}
              className="rounded-xl border border-grey bg-white shadow-sm"
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor:
                      CHART_COLOURS[i % CHART_COLOURS.length],
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-navy">
                      {holding.ticker}
                    </span>
                    <span className="truncate text-xs text-navy/50">
                      {holding.name}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="text-xs font-medium text-navy-light">
                      {holding.allocation_percent}%
                    </span>
                    <span className="rounded bg-grey-soft px-1.5 py-0.5 text-xs text-navy/50">
                      {holding.type}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => void handleExplain(holding.ticker)}
                  disabled={explaining === holding.ticker}
                  className="shrink-0 flex items-center gap-1 rounded-lg border border-grey px-2.5 py-1.5 text-xs font-medium text-navy/60 transition-colors hover:bg-grey-soft hover:text-navy disabled:opacity-50"
                >
                  {explaining === holding.ticker ? (
                    <RefreshCw className="h-3 w-3 animate-spin" />
                  ) : expanded === holding.ticker ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  Explain
                </button>
              </div>

              {/* Reasoning */}
              <div className="px-4 pb-3 text-xs leading-relaxed text-navy/60">
                {holding.reasoning}
              </div>

              {/* AI explanation drawer */}
              {expanded === holding.ticker && explanations[holding.ticker] && (
                <div className="border-t border-grey bg-navy/5 px-4 py-3 text-xs leading-relaxed text-navy/70">
                  <span className="mb-1 block font-semibold text-navy">
                    About {holding.ticker}
                  </span>
                  {explanations[holding.ticker]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
