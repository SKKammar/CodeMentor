"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface HintScoreChartProps {
  data: { date: string; avg_hints: number }[];
}

export default function HintScoreChart({ data }: HintScoreChartProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Hint Dependency Over Time
        <span className="ml-2 text-xs font-normal text-gray-500">
          (lower = better)
        </span>
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ left: 10, right: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#30363d"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#8b949e"
              fontSize={11}
              tickFormatter={(value) => {
                const d = new Date(value);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
            />
            <YAxis
              stroke="#8b949e"
              fontSize={12}
              label={{
                value: "Avg Hints",
                angle: -90,
                position: "insideLeft",
                style: { fill: "#8b949e", fontSize: 11 },
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "8px",
                color: "#e6edf3",
              }}
              formatter={(value: number) => [
                `${value} hints avg`,
                "Hint Score",
              ]}
            />
            <Line
              type="monotone"
              dataKey="avg_hints"
              stroke="#58a6ff"
              strokeWidth={2}
              dot={{ fill: "#58a6ff", r: 4 }}
              activeDot={{ fill: "#58a6ff", r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
