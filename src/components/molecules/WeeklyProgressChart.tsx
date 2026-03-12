"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export interface DataPoint {
    date: string;   // Etiqueta eje X: "Lun", "20/02", etc.
    value: number;  // 0 a 100
    evaluationSource?: string; // "Inmediata" o "Espaciada (IRI)"
}

interface WeeklyProgressChartProps {
    data?: DataPoint[];
    className?: string;
}

const defaultData: DataPoint[] = [
    { date: "Lun", value: 20 },
    { date: "Mar", value: 42 },
    { date: "Mié", value: 70 },
    { date: "Jue", value: 82 },
    { date: "Vie", value: 65 },
    { date: "Sáb", value: 60 },
    { date: "Dom", value: 85 },
];

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;

    const evalSource = payload[0].payload.evaluationSource;

    return (
        <div className="bg-background-secondary border border-border rounded-xl px-3 py-2 shadow-md text-sm">
            <p className="text-muted-foreground mb-1">{label}</p>
            <p className="font-semibold text-[#5B6AEB] text-lg leading-none">{payload[0].value}%</p>
            {evalSource && (
                <p className="text-xs text-muted-foreground mt-1.5">
                    Modo: <span className="font-medium">{evalSource}</span>
                </p>
            )}
        </div>
    );
}

export function WeeklyProgressChart({
    data = defaultData,
    className = "",
}: WeeklyProgressChartProps) {
    return (
        <div className={`w-full h-full ${className}`}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 16, left: -16, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5B6AEB" stopOpacity={0.25} />
                            <stop offset="95%" stopColor="#5B6AEB" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="currentColor"
                        strokeOpacity={0.08}
                        vertical={false}
                    />

                    <XAxis
                        dataKey="date"
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

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: "#5B6AEB", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />

                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#5B6AEB"
                        strokeWidth={2.5}
                        fill="url(#progressGradient)"
                        dot={{ fill: "#5B6AEB", r: 4, strokeWidth: 2, stroke: "white" }}
                        activeDot={{ r: 6, fill: "#5B6AEB", stroke: "white", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
