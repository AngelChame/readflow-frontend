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

export interface HistoryAttempt {
    id: number;
    timingTag: string;
    score: number;
    maxPossibleScore: number;
    completedAt: string;
    userAnswers: unknown;
    feedback: unknown;
    questions: unknown;
}

export interface HistorySessionDetail {
    id: number;
    title: string;
    summaryBody: string;
    createdAt: string;
    originalFilename: string;
    difficultyLevel: string;
    evaluationType: string;
    status: SessionStatus;
    retention: number | null;
    attempts: {
        t0: HistoryAttempt | null;
        t48: HistoryAttempt | null;
    };
}
