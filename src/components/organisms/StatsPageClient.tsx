"use client";

import { useState } from "react";
import { WeeklyProgressChart } from "@/components/molecules/WeeklyProgressChart";
import { SessionComparisonChart } from "@/components/molecules/SessionComparisonChart";
import StreakCard from "@/components/molecules/StreakCard";


function TopRetentionCard({ value = 90 }: { value?: number }) {
    return (
        <div className="relative rounded-2xl overflow-hidden bg-[#5B5BD6] h-full select-none">
            <div className="relative z-10 p-6 flex flex-col justify-start h-full">
                <span className="text-white font-bold leading-none"
                    style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}>
                    {value}%
                </span>
                <span className="text-white font-semibold mt-2"
                    style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.1rem)" }}>
                    Top retención
                </span>
            </div>
            <div className="absolute bottom-2 right-4 opacity-90 pointer-events-none">
                {/* Aqui va una imagen */}
            </div>
        </div>
    );
}


function SessionCountCard({ count = 15 }: { count?: number }) {
    return (
        <div className="bg-background-secondary border border-border rounded-2xl p-6 h-full flex flex-col items-center justify-center gap-3 shadow-sm">
            <span className="text-sm text-muted-foreground font-medium">Número de sesiones</span>
            <span className="text-5xl font-bold text-foreground">{count}</span>
            {/* Aqui va una imagen */}
        </div>
    );
}


const TABS = [
    { key: "iri", label: "IRI por sesión" },
    { key: "inmediato", label: "Inmediato" },
] as const;
type TabKey = (typeof TABS)[number]["key"];


export default function StatsPageClient({ streak }: { streak: number }) {
    const [activeTab, setActiveTab] = useState<TabKey>("iri");

    return (
        <div className="grid grid-rows-[58%_40%] gap-4 h-full">

            <div className="bg-background-secondary rounded-2xl border border-border shadow-sm p-6 flex flex-col overflow-hidden">

                <div className="flex gap-2 mb-4 shrink-0">
                    {TABS.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={[
                                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                                activeTab === tab.key
                                    ? "bg-foreground text-background"
                                    : "border border-border text-foreground hover:bg-hover",
                            ].join(" ")}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="flex-1 min-h-0">
                    {activeTab === "iri"
                        ? <WeeklyProgressChart />
                        : <SessionComparisonChart />
                    }
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4 h-full">
                <TopRetentionCard value={90} />
                <SessionCountCard count={15} />
                <StreakCard streak={streak} />
            </div>

        </div>
    );
}
