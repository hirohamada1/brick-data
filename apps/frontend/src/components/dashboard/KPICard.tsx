import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  sparkline?: number[];
  className?: string;
}

export function KPICard({
  title,
  value,
  icon: Icon,
  trend,
  sparkline,
  className,
}: KPICardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">{trend.label}</p>
        )}
        {sparkline && sparkline.length > 0 && (
          <div className="mt-4 flex items-end gap-0.5 h-10">
            {sparkline.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/30 min-h-[2px]"
                style={{ height: `${Math.max(4, (v / Math.max(...sparkline)) * 100)}%` }}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
