import { Summary } from "@/lib/types";
import { Card } from "@/components/Card";
import { Cell, PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export function AllocationCard({ summary }: { summary: Summary | null }) {
  const allocation = summary?.allocation ?? [];
  const data = allocation.map((a) => ({
    name: a.symbol,
    value: a.weight,
  }));

  function hashToHue(str: string) {
    let h = 0;
    for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
    return h % 360;
  }

  function colorForSymbol(symbol: string) {
    const hue = hashToHue(symbol);
    return `hsl(${hue} 70% 55%)`;
  }

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
                <Pie data={data} dataKey="value" nameKey="name" outerRadius={90}>
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={colorForSymbol(entry.name)} />
                  ))}
                </Pie>
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
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: colorForSymbol(a.symbol) }}
                      />
                      <span className="truncate text-zinc-200">{a.symbol}</span>
                    </div>
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
