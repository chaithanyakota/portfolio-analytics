"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import type { Portfolio } from "@/lib/types";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";

export function AddTransactionCard({
  portfolios,
  selectedPortfolioId,
  onCreated,
}: {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onCreated: () => Promise<void> | void;
}) {
  const [portfolioId, setPortfolioId] = useState(selectedPortfolioId);
  const [symbol, setSymbol] = useState("AAPL");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("100");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // keep dropdown synced if selected portfolio changes
  useMemo(() => {
    if (selectedPortfolioId) setPortfolioId(selectedPortfolioId);
  }, [selectedPortfolioId]);

  async function submit() {
    setErr(null);
    if (!portfolioId) return setErr("Create/select a portfolio first.");

    const q = Number(quantity);
    const p = Number(price);

    if (!symbol.trim()) return setErr("Symbol is required.");
    if (!Number.isFinite(q) || q <= 0) return setErr("Quantity must be > 0.");
    if (!Number.isFinite(p) || p <= 0) return setErr("Price must be > 0.");

    setLoading(true);
    try {
      await api.post("/transactions", {
        portfolio_id: portfolioId,
        symbol: symbol.trim().toUpperCase(),
        side,
        quantity: q,
        price: p,
      });
      await onCreated();
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="text-sm font-semibold">Add transaction</h3>
      <p className="mt-1 text-xs text-zinc-400">
        Creates a buy/sell transaction and refreshes analytics.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div>
          <div className="text-xs text-zinc-400">Portfolio</div>
          <select
            className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            value={portfolioId}
            onChange={(e) => setPortfolioId(e.target.value)}
          >
            {portfolios.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="text-xs text-zinc-400">Side</div>
          <select
            className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
            value={side}
            onChange={(e) => setSide(e.target.value as "buy" | "sell")}
          >
            <option value="buy">buy</option>
            <option value="sell">sell</option>
          </select>
        </div>

        <div>
          <div className="text-xs text-zinc-400">Symbol</div>
          <Input className="mt-2" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-zinc-400">Quantity</div>
            <Input className="mt-2" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
          </div>
          <div>
            <div className="text-xs text-zinc-400">Price</div>
            <Input className="mt-2" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
        </div>
      </div>

      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

      <div className="mt-4 flex justify-end">
        <Button disabled={loading || portfolios.length === 0} onClick={submit}>
          {loading ? "Adding..." : "Add"}
        </Button>
      </div>
    </div>
  );
}
