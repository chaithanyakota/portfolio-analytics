import { Summary } from "@/lib/types";
import { Card } from "@/components/Card"; 
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export function AllocationCard({ summary }: { summary: Summary | null }) {
  const allocation = summary?.allocation ?? [];
  const data = allocation.map((a) => ({
    name: a.symbol,
    value: a.weight,
  }));

  return (
    <Card title="Allocation" subtitle="Holdings weight by symbol">
      {data.length === 0 ? (
        <p className="text-sm text-zinc-400">No holdings yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          {/* Chart area (never grows beyond this height) */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={90} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend area (scrolls if long) */}
          <div className="max-h-64 overflow-auto rounded-lg border border-zinc-800 p-3">
            <div className="text-xs text-zinc-500">Top holdings</div>
            <div className="mt-2 space-y-2 text-sm">
              {allocation
                .slice() // copy
                .sort((a, b) => b.weight - a.weight)
                .map((a) => (
                  <div key={a.symbol} className="flex items-center justify-between gap-3">
                    <span className="truncate text-zinc-200">{a.symbol}</span>
                    <span className="shrink-0 tabular-nums text-zinc-400">
                      {(a.weight * 100).toFixed(2)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
