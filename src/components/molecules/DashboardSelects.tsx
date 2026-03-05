"use client";

import type { DifficultyLevel, EvaluationType } from "@/types/api/catalogs.types";

interface DashboardSelectsProps {
    difficulties: DifficultyLevel[];
    evaluationTypes: EvaluationType[];
    onDifficultyChange?: (id: number) => void;
    onEvaluationTypeChange?: (id: number) => void;
}

export default function DashboardSelects({
    difficulties,
    evaluationTypes,
}: DashboardSelectsProps) {
    return (
        <div className="flex items-center gap-8 justify-center mb-6">
            <select
                defaultValue=""
                className="text-base font-medium border border-border-secondary rounded-2xl px-4 py-2 text-foreground bg-background-secondary outline-none"
                onChange={() => { }}
            >
                <option value="" disabled>
                    Selecciona el tipo de resumen
                </option>
                {evaluationTypes.map((et) => (
                    <option key={et.id} value={et.id}>
                        {et.displayName}
                    </option>
                ))}
            </select>

            <select
                defaultValue=""
                className="text-base font-medium border border-border-secondary rounded-2xl px-4 py-2 text-foreground bg-background-secondary outline-none"
                onChange={() => { }}
            >
                <option value="" disabled>
                    Seleccione dificultad de la evaluación
                </option>
                {difficulties.map((d) => (
                    <option key={d.id} value={d.id}>
                        {d.displayName}
                    </option>
                ))}
            </select>
        </div>
    );
}
