"use client";

import { useState } from "react";
import { WeeklyProgressChart } from "@/components/molecules/WeeklyProgressChart";
import { SessionComparisonChart } from "@/components/molecules/SessionComparisonChart";
import StreakCard from "@/components/molecules/StreakCard";
import { BrainIllustration } from "@/components/atoms/icons/BrainIllustration";
import { BookIllustration } from "@/components/atoms/icons/BookIllustration";
import type { DataPoint } from "@/components/molecules/WeeklyProgressChart";
import type { SessionComparisonPoint } from "@/components/molecules/SessionComparisonChart";

function TopRetentionCard({ value }: { value: number | null }) {
  return (
    <div className="relative rounded-2xl overflow-hidden bg-[#5B6AEB] h-full select-none flex flex-col items-center">
      <div className="relative z-10 pt-4 flex flex-col items-center w-full">
        <span
          className="text-white font-bold leading-none tracking-tight"
          style={{ fontSize: "56px" }}
        >
          {value !== null ? `${value}%` : "—"}
        </span>
        <span
          className="text-white font-semibold mt-1"
          style={{ fontSize: "16px" }}
        >
          Top retención
        </span>
      </div>

      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none">
        <BrainIllustration
          className="w-[60%] h-auto drop-shadow-sm opacity-100 object-contain"
          size={300}
        />
      </div>
    </div>
  );
}

function SessionCountCard({ count }: { count: number }) {
  return (
    <div className="relative bg-background-secondary border border-border rounded-2xl overflow-hidden h-full flex flex-col items-center shadow-sm">
      <div className="relative z-10 pt-5 flex flex-col items-center gap-1 w-full">
        <span className="text-[17px] text-foreground font-medium">
          Número de sesiones
        </span>
        <span className="text-[56px] font-bold text-foreground leading-none tracking-tight">
          {count}
        </span>
      </div>

      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none">
        <BookIllustration
          className="w-[45%] h-auto drop-shadow-sm opacity-100 object-contain"
          size={250}
        />
      </div>
    </div>
  );
}

const TABS = [
  { key: "iri", label: "IRI por sesión" },
  { key: "inmediato", label: "Inmediato" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

interface StatsPageClientProps {
  streak: number;
  weeklyData?: DataPoint[];
  comparisonData?: SessionComparisonPoint[];
  bestIri: number | null;
  sessionsCompleted: number;
}

export default function StatsPageClient({
  streak,
  weeklyData,
  comparisonData,
  bestIri,
  sessionsCompleted,
}: StatsPageClientProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("iri");

  return (
    <div className="flex flex-col md:grid md:grid-rows-[58%_40%] gap-4 h-full">
      <div className="bg-background-secondary rounded-2xl border border-border shadow-sm p-6 flex flex-col overflow-hidden h-full">
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

        <div className="flex-1 min-h-0 h-fit">
          {activeTab === "iri" ? (
            <WeeklyProgressChart data={weeklyData} />
          ) : (
            <SessionComparisonChart data={comparisonData} />
          )}
        </div>
      </div>

      <div className="flex flex-col md:grid md:grid-cols-3 gap-4 h-full">
        <TopRetentionCard value={bestIri} />
        <SessionCountCard count={sessionsCompleted} />
        <StreakCard streak={streak} />
      </div>
    </div>
  );
}
