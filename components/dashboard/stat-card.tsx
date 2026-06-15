import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconClassName?: string;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  iconClassName,
  description,
}: StatCardProps) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <p className="text-sm font-medium text-slate-500 truncate">{title}</p>
            <p className="text-3xl font-bold text-slate-900 tabular-nums">
              {value}
            </p>
            {change && (
              <p
                className={cn(
                  "text-xs font-medium",
                  changeType === "positive" && "text-emerald-600",
                  changeType === "negative" && "text-red-500",
                  changeType === "neutral" && "text-slate-500"
                )}
              >
                {change}
              </p>
            )}
            {description && (
              <p className="text-xs text-slate-400">{description}</p>
            )}
          </div>
          <div
            className={cn(
              "p-2.5 rounded-xl flex-shrink-0",
              iconClassName ?? "bg-slate-100 text-slate-600"
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
