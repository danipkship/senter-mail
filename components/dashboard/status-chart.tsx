"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDataPoint } from "@/lib/dashboard-utils";

interface StatusChartProps {
  data: StatusDataPoint[];
  total: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-lg px-3 py-2 text-xs">
      <div className="flex items-center gap-2">
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: item.payload.color }}
        />
        <span className="text-slate-600">{item.name}</span>
        <span className="font-semibold text-slate-800 ml-1">{item.value}</span>
      </div>
    </div>
  );
}

export function StatusChart({ data, total }: StatusChartProps) {
  return (
    <Card className="border border-slate-200 shadow-sm bg-white h-full rounded-lg">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-semibold text-slate-800">
          Customer Breakdown
        </CardTitle>
        <p className="text-xs text-slate-400 mt-0.5">{total} total customers</p>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex flex-col items-center">
          <div className="relative">
            <ResponsiveContainer width={200} height={180}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={82}
                  paddingAngle={2}
                  dataKey="value"
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-800 leading-none">{total}</span>
              <span className="text-xs text-slate-400 mt-0.5">total</span>
            </div>
          </div>

          {/* Custom legend */}
          <div className="w-full mt-2 space-y-1.5">
            {data.map((item) => {
              const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
              return (
                <div key={item.name} className="flex items-center justify-between gap-3 px-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-xs text-slate-600 truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-16 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-700 w-4 text-right">{item.value}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
