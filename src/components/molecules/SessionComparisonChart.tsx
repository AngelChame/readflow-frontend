"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
export interface SessionComparisonPoint {
  session: string;   // Nombre/número de sesión: "Ses. 1", "La Ansiedad"
  inmediato: number; // Resultado inmediato (0-100)
  diferido: number;  // Resultado diferido/IRI (0-100)
}
interface SessionComparisonChartProps {
  data?: SessionComparisonPoint[];
  className?: string;
}
const defaultData: SessionComparisonPoint[] = [
  { session: "Ses. 1", inmediato: 72, diferido: 65 },
  { session: "Ses. 2", inmediato: 85, diferido: 78 },
  { session: "Ses. 3", inmediato: 60, diferido: 55 },
  { session: "Ses. 4", inmediato: 90, diferido: 82 },
  { session: "Ses. 5", inmediato: 78, diferido: 70 },
];
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-background-secondary border border-border rounded-xl px-3 py-2 shadow-md text-sm space-y-1">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.name} style={{ color: entry.fill }}>
          {entry.name === "inmediato" ? "Inmediato" : "Diferido (IRI)"}: {entry.value}%
        </p>
      ))}
    </div>
  );
}
export function SessionComparisonChart({
  data = defaultData,
  className = "",
}: SessionComparisonChartProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 16, left: -16, bottom: 0 }}
          barGap={4}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            strokeOpacity={0.08}
            vertical={false}
          />
          <XAxis
            dataKey="session"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
            ticks={[20, 40, 60, 80, 100]}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "currentColor", fillOpacity: 0.04 }} />
          <Legend
            formatter={(value) => value === "inmediato" ? "Inmediato" : "Diferido (IRI)"}
            wrapperStyle={{ fontSize: "12px", opacity: 0.6 }}
          />
          <Bar dataKey="inmediato" fill="#5B6AEB" radius={[4, 4, 0, 0]} maxBarSize={32} />
          <Bar dataKey="diferido"  fill="#A5ADFC" radius={[4, 4, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
