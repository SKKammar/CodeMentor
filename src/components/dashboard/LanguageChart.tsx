"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface LanguageChartProps {
  data: { language: string; count: number }[];
}

const COLORS = [
  "#58a6ff",
  "#3fb950",
  "#d29922",
  "#f85149",
  "#bc8cff",
  "#79c0ff",
  "#56d4dd",
  "#e3b341",
];

export default function LanguageChart({ data }: LanguageChartProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Languages Used
      </h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <XAxis type="number" stroke="#8b949e" fontSize={12} />
            <YAxis
              dataKey="language"
              type="category"
              stroke="#8b949e"
              fontSize={12}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#161b22",
                border: "1px solid #30363d",
                borderRadius: "8px",
                color: "#e6edf3",
              }}
            />
            <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={20}>
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
