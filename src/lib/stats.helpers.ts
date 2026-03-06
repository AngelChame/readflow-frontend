import type { DataPoint } from "@/components/molecules/WeeklyProgressChart";
import type { SessionComparisonPoint } from "@/components/molecules/SessionComparisonChart";
import type { IriTimelineEntry, ScoreComparisonEntry } from "@/types/api/stats.types";

const DAY_LABELS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

/*Convierte iriTimeline del backend en 7 puntos (últimos 7 días)
 para el WeeklyProgressChart. Usa IRI si está disponible, si no scoreT0.*/  
export function buildWeeklyChartData(
    iriTimeline: IriTimelineEntry[],
    scoreComparison: ScoreComparisonEntry[]
): DataPoint[] {
    const today = new Date();
    const days: DataPoint[] = [];

    for (let i = 6; i >= 0; i--) {
        const day = new Date(today);
        day.setDate(today.getDate() - i);
        const dayStart = new Date(day.setHours(0, 0, 0, 0));
        const dayEnd = new Date(day.setHours(23, 59, 59, 999));

        const sessionsOfDay = iriTimeline.filter((s) => {
            const d = new Date(s.createdAt);
            return d >= dayStart && d <= dayEnd;
        });

        let value = 0;
        if (sessionsOfDay.length > 0) {
            const values = sessionsOfDay.map((s) => {
                if (s.iri !== null) return s.iri;
                const sc = scoreComparison.find((c) => c.sessionId === s.sessionId);
                return sc?.scoreT0 ?? 0;
            });
            value = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
        }

        days.push({
            date: DAY_LABELS[dayStart.getDay()],
            value,
        });
    }

    return days;
}

/*Convierte scoreComparison del backend en puntos para SessionComparisonChart.
 Muestra las últimas 8 sesiones con scoreT0 (inmediato) y scoreT48/IRI (diferido).*/
export function buildSessionComparisonData(
    scoreComparison: ScoreComparisonEntry[]
): SessionComparisonPoint[] {
    return scoreComparison.slice(-8).map((s, i) => ({
        session: s.title.length > 12 ? s.title.slice(0, 12) + "…" : s.title,
        inmediato: Math.round(s.scoreT0 ?? 0),
        diferido: Math.round(s.scoreT48 ?? 0),
    }));
}

