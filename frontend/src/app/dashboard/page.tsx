"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api, setAuthToken } from "@/lib/api";
import { tokenStore } from "@/lib/auth";
import type { Portfolio, Summary, ValueResp } from "@/lib/types";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { StatCard } from "@/components/StatCard";
import { AllocationCard } from "@/components/AllocationCard"; 
import { PositionsTable } from "@/components/PositionsTable";

function money(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export default function DashboardPage() {
  const router = useRouter();

  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [newName, setNewName] = useState("");

  const [summary, setSummary] = useState<Summary | null>(null);
  const [valueResp, setValueResp] = useState<ValueResp | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 1) auth guard: if no token, go login
  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      router.push("/login");
      return;
    }
    setAuthToken(token);
    void loadPortfolios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadPortfolios() {
    setErr(null);
    try {
      const res = await api.get<Portfolio[]>("/portfolios");
      setPortfolios(res.data);
      if (res.data.length > 0) setSelectedId(res.data[0].id);
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to load portfolios");
    }
  }

  // 2) whenever portfolio changes, load analytics
  useEffect(() => {
    if (!selectedId) return;
    void loadAnalytics(selectedId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  async function loadAnalytics(pid: string) {
    setLoading(true);
    setErr(null);
    try {
      const [s, v] = await Promise.all([
        api.get<Summary>(`/analytics/portfolios/${pid}/summary`),
        api.get<ValueResp>(`/analytics/portfolios/${pid}/value`),
      ]);
      setSummary(s.data);
      setValueResp(v.data);
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  }

  async function createPortfolio() {
    const name = newName.trim();
    if (!name) return;
    setErr(null);
    try {
      await api.post("/portfolios", { name });
      setNewName("");
      await loadPortfolios();
    } catch (e: any) {
      setErr(e?.response?.data?.detail ?? "Failed to create portfolio");
    }
  }

  function logout() {
    tokenStore.clear();
    setAuthToken(null);
    router.push("/login");
  }

  const headline = useMemo(() => {
    if (!summary) return null;
    return {
      totalValue: `$${money(summary.total_value)}`,
      costBasis: `$${money(summary.total_cost_basis)}`,
      gain: `$${money(summary.total_unrealized_gain)}`,
      ret: `${(summary.total_return_pct * 100).toFixed(2)}%`,
    };
  }, [summary]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Portfolio Analytics</h1>
            <p className="mt-1 text-sm text-zinc-400">
              SaaS-style portfolio dashboard (MVP)
            </p>
          </div>
          <Button onClick={logout} className="bg-zinc-900 text-zinc-100 hover:bg-zinc-800">
            Logout
          </Button>
        </div>

        {err && (
          <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 px-4 py-3 text-sm text-red-300">
            {err}
          </div>
        )}

        {/* Portfolio controls */}
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
            <div className="text-xs text-zinc-400">Portfolio</div>
            <select
              className="mt-2 w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm"
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
            >
              {portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {portfolios.length === 0 && (
              <p className="mt-2 text-sm text-zinc-400">
                No portfolios yet — create one.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 md:col-span-2">
            <div className="text-xs text-zinc-400">Create portfolio</div>
            <div className="mt-2 flex gap-2">
              <Input
                placeholder="e.g., Main"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Button onClick={createPortfolio}>Create</Button>
            </div>
          </div>
        </div>

        {/* Headline stats */}
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <StatCard label="Total Value" value={headline?.totalValue ?? (loading ? "…" : "$0.00")} />
          <StatCard label="Cost Basis" value={headline?.costBasis ?? (loading ? "…" : "$0.00")} />
          <StatCard label="Unrealized Gain" value={headline?.gain ?? (loading ? "…" : "$0.00")} />
          <StatCard label="Return %" value={headline?.ret ?? (loading ? "…" : "0.00%")} />
        </div>

        {/* Charts + tables */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <AllocationCard summary={summary} />
          <PositionsTable data={valueResp} />
        </div>

        {/* Loading hint */}
        {loading && (
          <p className="mt-4 text-sm text-zinc-500">Loading analytics…</p>
        )}
      </div>
    </main>
  );
}
