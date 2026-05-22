"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaystackButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleUpgrade() {
    setLoading(true);
    try {
      const res = await fetch("/api/paystack/initiate", { method: "POST" });
      if (res.status === 401) {
        router.push("/login?next=/pricing");
        return;
      }
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment setup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className="block w-full rounded-lg bg-white px-6 py-3 text-center text-sm font-semibold text-navy transition-colors hover:bg-white/90 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {loading ? "Redirecting…" : "Start 14-day free trial"}
    </button>
  );
}
