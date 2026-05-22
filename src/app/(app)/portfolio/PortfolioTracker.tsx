"use client";

import { useState, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Plus, X, TrendingUp, TrendingDown, Loader2 } from "lucide-react";

type Holding = {
  id: string;
  ticker: string;
  name: string;
  units: number;
  avg_price: number;
  purchase_date: string;
};

type LivePrice = {
  price: number;
  change?: number;
  changePercent?: number;
};

const CHART_COLOURS = [
  "#1F4E79",
  "#2a6aa8",
  "#3b82f6",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
];

const fmt = (n: number) =>
  `R ${n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Props = {
  initialHoldings: Holding[];
};

export default function PortfolioTracker({ initialHoldings }: Props) {
  const [holdings, setHoldings] = useState<Holding[]>(initialHoldings);
  const [prices, setPrices] = useState<Record<string, LivePrice>>({});
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    ticker: "",
    name: "",
    units: "",
    avg_price: "",
    purchase_date: new Date().toISOString().split("T")[0],
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchPrices = useCallback(async (tickers: string[]) => {
    if (tickers.length === 0) return;
    setLoadingPrices(true);
    const results: Record<string, LivePrice> = {};
    await Promise.allSettled(
      tickers.map(async (t) => {
        const res = await fetch(`/api/price?ticker=${encodeURIComponent(t)}`);
        if (res.ok) {
          const data = (await res.json()) as LivePrice & { ticker: string };
          results[t] = { price: data.price, change: data.change, changePercent: data.changePercent };
        }
      })
    );
    setPrices((prev) => ({ ...prev, ...results }));
    setLoadingPrices(false);
  }, []);

  const handleAddHolding = async () => {
    setFormError(null);
    const units = parseFloat(form.units);
    const avgPrice = parseFloat(form.avg_price);
    if (!form.ticker || !form.name || isNaN(units) || isNaN(avgPrice)) {
      setFormError("Please fill in all fields with valid values.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/holdings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: form.ticker.toUpperCase(),
          name: form.name,
          units,
          avg_price: avgPrice,
          purchase_date: form.purchase_date,
        }),
      });
      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to save holding");
      }
      const newHolding = (await res.json()) as Holding;
      setHoldings((prev) => [newHolding, ...prev]);
      setShowModal(false);
      setForm({
        ticker: "",
        name: "",
        units: "",
        avg_price: "",
        purchase_date: new Date().toISOString().split("T")[0],
      });
      void fetchPrices([newHolding.ticker]);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/holdings/${id}`, { method: "DELETE" });
    setHoldings((prev) => prev.filter((h) => h.id !== id));
  };

  const totalCost = holdings.reduce((s, h) => s + h.units * h.avg_price, 0);
  const totalValue = holdings.reduce((s, h) => {
    const livePrice = prices[h.ticker]?.price ?? h.avg_price;
    return s + h.units * livePrice;
  }, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPct = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const pieData = holdings.map((h) => ({
    name: h.ticker,
    value: parseFloat(((h.units * h.avg_price) / Math.max(totalCost, 1) * 100).toFixed(1)),
  }));

  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-grey bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-navy/50">Total invested</p>
          <p className="mt-2 text-xl font-bold text-navy">{fmt(totalCost)}</p>
        </div>
        <div className="rounded-xl border border-grey bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-navy/50">Current value</p>
          <p className="mt-2 text-xl font-bold text-navy">
            {loadingPrices ? "Fetching…" : fmt(totalValue)}
          </p>
        </div>
        <div className="rounded-xl border border-grey bg-white p-5 shadow-sm">
          <p className="text-xs font-medium text-navy/50">Total gain / loss</p>
          <p
            className={`mt-2 text-xl font-bold ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}
          >
            {totalGain >= 0 ? "+" : ""}
            {fmt(totalGain)} ({totalGainPct >= 0 ? "+" : ""}
            {totalGainPct.toFixed(2)}%)
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-navy">Holdings</h2>
        <div className="flex gap-2">
          <button
            onClick={() => void fetchPrices(holdings.map((h) => h.ticker))}
            disabled={loadingPrices || holdings.length === 0}
            className="flex items-center gap-1.5 rounded-lg border border-grey px-3 py-2 text-xs font-medium text-navy/60 transition-colors hover:bg-grey-soft hover:text-navy disabled:opacity-40"
          >
            {loadingPrices && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Refresh prices
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-navy px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-navy-light"
          >
            <Plus className="h-3.5 w-3.5" />
            Add holding
          </button>
        </div>
      </div>

      {holdings.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-grey bg-white p-12 text-center">
          <p className="text-sm text-navy/50">No holdings yet.</p>
          <p className="mt-1 text-xs text-navy/40">
            Click &quot;Add holding&quot; to log your first investment.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie chart */}
          <div className="rounded-xl border border-grey bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-navy">
              Allocation
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={CHART_COLOURS[i % CHART_COLOURS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Holdings table */}
          <div className="overflow-hidden rounded-xl border border-grey bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-grey bg-grey-soft text-left text-xs font-medium text-navy/50">
                  <th className="px-4 py-3">Ticker</th>
                  <th className="px-4 py-3 text-right">Units</th>
                  <th className="px-4 py-3 text-right">Avg price</th>
                  <th className="px-4 py-3 text-right">Gain/Loss</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => {
                  const live = prices[h.ticker]?.price ?? h.avg_price;
                  const gain = (live - h.avg_price) * h.units;
                  const gainPct = ((live - h.avg_price) / h.avg_price) * 100;
                  const isUp = gain >= 0;
                  return (
                    <tr
                      key={h.id}
                      className="border-b border-grey last:border-0"
                    >
                      <td className="px-4 py-3 font-semibold text-navy">
                        {h.ticker}
                        <span className="ml-1.5 text-xs font-normal text-navy/40">
                          {h.name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-navy/70">
                        {h.units}
                      </td>
                      <td className="px-4 py-3 text-right text-navy/70">
                        R {h.avg_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div
                          className={`flex items-center justify-end gap-1 font-medium ${isUp ? "text-green-600" : "text-red-600"}`}
                        >
                          {isUp ? (
                            <TrendingUp className="h-3.5 w-3.5" />
                          ) : (
                            <TrendingDown className="h-3.5 w-3.5" />
                          )}
                          {isUp ? "+" : ""}
                          {gainPct.toFixed(2)}%
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => void handleDelete(h.id)}
                          className="text-navy/30 transition-colors hover:text-red-500"
                          aria-label={`Remove ${h.ticker}`}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add holding modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-navy">Add holding</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-navy/40 hover:text-navy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-navy/60">
                    Ticker
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. NPN.JO"
                    value={form.ticker}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, ticker: e.target.value.toUpperCase() }))
                    }
                    className="w-full rounded-lg border border-grey px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-navy/60">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Naspers"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                    className="w-full rounded-lg border border-grey px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-navy/60">
                    Units held
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="10"
                    value={form.units}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, units: e.target.value }))
                    }
                    className="w-full rounded-lg border border-grey px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-navy focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-navy/60">
                    Avg buy price (ZAR)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="250.00"
                    value={form.avg_price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, avg_price: e.target.value }))
                    }
                    className="w-full rounded-lg border border-grey px-3 py-2.5 text-sm text-navy placeholder-navy/30 focus:border-navy focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-navy/60">
                  Purchase date
                </label>
                <input
                  type="date"
                  value={form.purchase_date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, purchase_date: e.target.value }))
                  }
                  className="w-full rounded-lg border border-grey px-3 py-2.5 text-sm text-navy focus:border-navy focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg border border-grey px-4 py-2.5 text-sm font-medium text-navy/60 transition-colors hover:bg-grey-soft"
              >
                Cancel
              </button>
              <button
                onClick={() => void handleAddHolding()}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Add holding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
