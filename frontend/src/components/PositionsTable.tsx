import { ValueResp } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

function fmt(n: number) {
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

export function PositionsTable({ data }: { data: ValueResp | null }) {
  const positions = data?.positions ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Positions</CardTitle>
        <CardDescription>Current holdings and market values</CardDescription>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No positions yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Gain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((p) => (
                <TableRow key={p.symbol}>
                  <TableCell className="font-medium">{p.symbol}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {p.quantity.toFixed(4)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${fmt(p.price)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    ${fmt(p.market_value)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={p.unrealized_gain >= 0 ? "default" : "destructive"}
                      className="tabular-nums"
                    >
                      ${fmt(p.unrealized_gain)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
