import { Summary } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Cell, PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

function hashToHue(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}

function colorForSymbol(symbol: string) {
  const hue = hashToHue(symbol);
  return `hsl(${hue} 70% 55%)`;
}

export function AllocationCard({ summary }: { summary: Summary | null }) {
  const allocation = summary?.allocation ?? [];
  const data = allocation.map((a) => ({
    name: a.symbol,
    value: a.weight,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Allocation</CardTitle>
        <CardDescription>Holdings weight by symbol</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground">No holdings yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_180px]">
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

            <div className="max-h-64 overflow-auto rounded-lg border p-3">
              <p className="text-xs text-muted-foreground">Top holdings</p>
              <div className="mt-2 space-y-2 text-sm">
                {allocation
                  .slice()
                  .sort((a, b) => b.weight - a.weight)
                  .map((a) => (
                    <div
                      key={a.symbol}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: colorForSymbol(a.symbol) }}
                        />
                        <span className="truncate">{a.symbol}</span>
                      </div>
                      <span className="shrink-0 tabular-nums text-muted-foreground">
                        {(a.weight * 100).toFixed(2)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
