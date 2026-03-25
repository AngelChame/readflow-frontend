"use client";

import type {
  DifficultyLevel,
  EvaluationType,
} from "@/types/api/catalogs.types";

import { ChevronDown } from "lucide-react";

interface DashboardSelectsProps {
  difficulties: DifficultyLevel[];
  evaluationTypes: EvaluationType[];
  onDifficultyChange?: (id: number) => void;
  onEvaluationTypeChange?: (id: number) => void;
}

export default function DashboardSelects({
  difficulties,
  evaluationTypes,
  onDifficultyChange,
  onEvaluationTypeChange,
}: DashboardSelectsProps) {
  return (
    <div className="flex items-center gap-8 justify-center mb-6">
      <div className="relative">
        <select
          defaultValue=""
          className="appearance-none text-base font-medium border border-border-secondary rounded-2xl pl-4 pr-10 py-2 text-foreground bg-background-secondary outline-none w-full"
          onChange={(e) => onDifficultyChange?.(Number(e.target.value))}
        >
          <option value="" disabled>
            Selecciona el nivel de resumen
          </option>
          {difficulties.map((d) => (
            <option key={d.id} value={d.id}>
              {d.displayName}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground">
          <ChevronDown></ChevronDown>
        </span>
      </div>

      <div className="relative">
        <select
          defaultValue=""
          className="appearance-none text-base font-medium border border-border-secondary rounded-2xl pl-4 pr-10 py-2 text-foreground bg-background-secondary outline-none w-full"
          onChange={(e) => onEvaluationTypeChange?.(Number(e.target.value))}
        >
          <option value="" disabled>
            Selecciona el tipo de evaluación
          </option>
          {evaluationTypes.map((et) => (
            <option key={et.id} value={et.id}>
              {et.displayName}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-foreground">
          <ChevronDown></ChevronDown>
        </span>
      </div>
    </div>
  );
}
