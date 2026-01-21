import { ValueResp } from "@/lib/types";
import { Card } from "./Card";

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function PositionsTable({ data }: { data: ValueResp | null }) {
  const positions = data?.positions ?? [];
  if (!positions.length) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
        <h3 className="text-sm font-semibold">Positions</h3>
        <p className="mt-2 text-sm text-zinc-400">No positions yet.</p>
      </div>
    );
  }

  return (
    <Card title="Positions">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="text-sm font-semibold">Positions</h3>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-zinc-400">
            <tr className="border-b border-zinc-800">
              <th className="py-2 text-left font-medium">Symbol</th>
              <th className="py-2 text-right font-medium">Qty</th>
              <th className="py-2 text-right font-medium">Price</th>
              <th className="py-2 text-right font-medium">Value</th>
              <th className="py-2 text-right font-medium">Gain</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((p) => (
              <tr key={p.symbol} className="border-b border-zinc-900">
                <td className="py-2">{p.symbol}</td>
                <td className="py-2 text-right">{p.quantity.toFixed(4)}</td>
                <td className="py-2 text-right">${fmt(p.price)}</td>
                <td className="py-2 text-right">${fmt(p.market_value)}</td>
                <td className="py-2 text-right">
                  ${fmt(p.unrealized_gain)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </Card>
  );
}
