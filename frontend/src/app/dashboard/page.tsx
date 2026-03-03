"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { api, setAuthToken } from "@/lib/api";
import { tokenStore } from "@/lib/auth";
import type { Portfolio, Summary, ValueResp } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { AlertCircleIcon, LogOutIcon } from "lucide-react";

import { StatCard } from "@/components/StatCard";
import { AllocationCard } from "@/components/AllocationCard";
import { PositionsTable } from "@/components/PositionsTable";
import { AddTransactionCard } from "@/components/AddTransactionsCard";

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
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { detail?: string } } };
      setErr(axiosErr?.response?.data?.detail ?? "Failed to load portfolios");
    }
  }

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
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { detail?: string } } };
      setErr(axiosErr?.response?.data?.detail ?? "Failed to load analytics");
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
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { detail?: string } } };
      setErr(axiosErr?.response?.data?.detail ?? "Failed to create portfolio");
    }
  }

  async function refreshCurrent() {
    if (!selectedId) return;
    await loadAnalytics(selectedId);
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
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Portfolio Analytics
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Portfolio Dashboard
            </p>
          </div>
          <Button variant="outline" onClick={logout}>
            <LogOutIcon />
            Logout
          </Button>
        </div>

        <Separator className="my-6" />

        {/* Error alert */}
        {err && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircleIcon />
            <AlertDescription>{err}</AlertDescription>
          </Alert>
        )}

        {/* Portfolio controls */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              {portfolios.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No portfolios yet — create one.
                </p>
              ) : (
                <Select value={selectedId} onValueChange={setSelectedId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select portfolio" />
                  </SelectTrigger>
                  <SelectContent>
                    {portfolios.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardDescription>Create portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1 space-y-1">
                  <Label htmlFor="new-portfolio" className="sr-only">
                    Portfolio name
                  </Label>
                  <Input
                    id="new-portfolio"
                    placeholder="e.g., Main"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        createPortfolio();
                      }
                    }}
                  />
                </div>
                <Button onClick={createPortfolio}>Create</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Headline stats */}
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <StatCard
            label="Total Value"
            value={headline?.totalValue ?? (loading ? "…" : "$0.00")}
          />
          <StatCard
            label="Cost Basis"
            value={headline?.costBasis ?? (loading ? "…" : "$0.00")}
          />
          <StatCard
            label="Unrealized Gain"
            value={headline?.gain ?? (loading ? "…" : "$0.00")}
          />
          <StatCard
            label="Return %"
            value={headline?.ret ?? (loading ? "…" : "0.00%")}
          />
        </div>

        {/* Charts + table */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <AllocationCard summary={summary} />
          <PositionsTable data={valueResp} />
        </div>

        {/* Loading indicator */}
        {loading && (
          <p className="mt-4 text-sm text-muted-foreground">
            Loading analytics…
          </p>
        )}

        {/* Add transaction */}
        <div className="mt-6">
          <AddTransactionCard
            portfolios={portfolios}
            selectedPortfolioId={selectedId}
            onCreated={refreshCurrent}
          />
        </div>
      </div>
    </main>
  );
}
