import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getPriceMovementData } from "@/data/mock";
import { formatCurrency } from "@/lib/utils";

export function PriceChart() {
  const [range, setRange] = useState<"7T" | "30T" | "12M">("30T");
  const data = getPriceMovementData(range);

  const formatXAxis = (value: string) => {
    const d = new Date(value);
    return d.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Preisbewegung (€/m²)</CardTitle>
        <Tabs value={range} onValueChange={(v) => setRange(v as "7T" | "30T" | "12M")}>
          <TabsList>
            <TabsTrigger value="7T">7T</TabsTrigger>
            <TabsTrigger value="30T">30T</TabsTrigger>
            <TabsTrigger value="12M">12M</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <YAxis
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "1rem",
                }}
                formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "€/m²"]}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("de-DE", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="pricePerSqm"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
