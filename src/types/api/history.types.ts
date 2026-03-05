export type SessionStatus = "pending" | "t0_completed" | "completed";

export interface StudySessionSummary {
    id: number;
    title: string;
    createdAt: string;
    difficultyLevel: string;
    evaluationType: string;
    scores: {
        t0: number | null;
        t48: number | null;
    };
    retention: number | null;
    status: SessionStatus;
    t48AvailableAt: string | null;
    t48Available: boolean;
}

export interface StudySessionsResponse {
    sessions: StudySessionSummary[];
}
