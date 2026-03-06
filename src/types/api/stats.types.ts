export interface IriTimelineEntry {
    sessionId: number;
    title: string;
    createdAt: string;
    evaluationType: string;
    difficultyLevel: string;
    iri: number | null;
}

export interface ScoreComparisonEntry {
    sessionId: number;
    title: string;
    createdAt: string;
    scoreT0: number | null;
    scoreT48: number | null;
    scoreImprovement: number | null;
}

export interface StatsKpis {
    avgIri: number | null;
    bestIri: number | null;
    sessionsCompleted: number;
    currentStreak: number;
}

export interface UserStatsResponse {
    kpis: StatsKpis;
    iriTimeline: IriTimelineEntry[];
    scoreComparison: ScoreComparisonEntry[];
}
