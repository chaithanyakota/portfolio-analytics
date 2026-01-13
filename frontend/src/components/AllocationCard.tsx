import { Summary } from "@/lib/types";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export function AllocationCard({ summary }: { summary: Summary | null }) {
  const allocation = summary?.allocation ?? [];
  const data = allocation.map((a) => ({
    name: a.symbol,
    value: a.weight,
  }));

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
      <h3 className="text-sm font-semibold">Allocation</h3>

      {data.length === 0 ? (
        <p className="mt-2 text-sm text-zinc-400">No holdings yet.</p>
      ) : (
        <div className="mt-3 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 space-y-1 text-sm">
            {allocation.slice(0, 6).map((a) => (
              <div key={a.symbol} className="flex justify-between text-zinc-300">
                <span>{a.symbol}</span>
                <span>{(a.weight * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
