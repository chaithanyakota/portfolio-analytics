"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Portfolio } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SymbolSearch } from "@/components/SymbolSearch";
import {
  Card,
  CardAction,
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
import { AlertCircleIcon, CheckCircleIcon, PlusIcon, XIcon } from "lucide-react";

export function AddTransactionCard({
  portfolios,
  selectedPortfolioId,
  onCreated,
}: {
  portfolios: Portfolio[];
  selectedPortfolioId: string;
  onCreated: () => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const [portfolioId, setPortfolioId] = useState(selectedPortfolioId);
  const [symbol, setSymbol] = useState("");
  const [side, setSide] = useState<"buy" | "sell">("buy");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("100");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPortfolioId) setPortfolioId(selectedPortfolioId);
  }, [selectedPortfolioId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(null);

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

      setOk("Transaction added.");
      setQuantity("1");
      await onCreated();
      setOpen(false);
    } catch (e: unknown) {
      const axiosErr = e as { response?: { data?: { detail?: string } } };
      setErr(axiosErr?.response?.data?.detail ?? "Failed to create transaction");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Add transaction</CardTitle>
        <CardDescription>Record a buy/sell and refresh analytics</CardDescription>
        <CardAction>
          <Button
            variant={open ? "ghost" : "outline"}
            size="sm"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <><XIcon /> Cancel</> : <><PlusIcon /> New</>}
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent>
        {!open ? (
          <p className="text-sm text-muted-foreground">
            Click <span className="text-foreground font-medium">New</span> to
            add a transaction.
          </p>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2 md:col-span-1">
                <Label>Portfolio</Label>
                <Select value={portfolioId} onValueChange={setPortfolioId}>
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
              </div>

              <div className="space-y-2">
                <Label>Side</Label>
                <Select
                  value={side}
                  onValueChange={(v) => setSide(v as "buy" | "sell")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Symbol</Label>
                <SymbolSearch value={symbol} onSelect={setSymbol} />
              </div>

              <div className="flex gap-3">
                <div className="w-1/2 space-y-2">
                  <Label>Qty</Label>
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="w-1/2 space-y-2">
                  <Label>Price</Label>
                  <Input
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {err && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertDescription>{err}</AlertDescription>
              </Alert>
            )}
            {ok && (
              <Alert>
                <CheckCircleIcon />
                <AlertDescription>{ok}</AlertDescription>
              </Alert>
            )}

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={loading || portfolios.length === 0}
              >
                {loading ? "Adding..." : "Add transaction"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
