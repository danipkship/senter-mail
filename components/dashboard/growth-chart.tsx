"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyDataPoint } from "@/lib/dashboard-utils";
import { TrendingUp } from "lucide-react";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; fill: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-lg px-3 py-2.5 text-xs">
      <p className="font-semibold text-slate-700 mb-1.5">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5 text-slate-500">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: p.fill }}
            />
            {p.name}
          </span>
          <span className="font-semibold text-slate-800">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function GrowthChart({ data }: { data: MonthlyDataPoint[] }) {
  const totalNew = data.reduce((s, d) => s + d.new, 0);
  const totalCancelled = data.reduce((s, d) => s + d.cancelled, 0);
  const net = totalNew - totalCancelled;

  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full rounded-lg">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-semibold text-slate-800">
              Customer Volume
            </CardTitle>
            <p className="text-xs text-slate-400 mt-0.5">New vs. cancelled — last 6 months</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md px-2 py-1 flex-shrink-0">
            <TrendingUp className="w-3 h-3" />
            +{net} net
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 pt-2">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span className="text-xs text-slate-500">New</span>
            <span className="text-xs font-semibold text-slate-700 ml-0.5">{totalNew}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 rounded-sm bg-rose-300" />
            <span className="text-xs text-slate-500">Cancelled</span>
            <span className="text-xs font-semibold text-slate-700 ml-0.5">{totalCancelled}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} barGap={3} barSize={14} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc", radius: 4 }} />
            <Bar
              dataKey="new"
              name="New"
              fill="#2563eb"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="cancelled"
              name="Cancelled"
              fill="#fca5a5"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
