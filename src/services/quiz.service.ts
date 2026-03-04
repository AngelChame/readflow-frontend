import { apiFetch } from "@/services/api.service";
import type { QuizApiResponse, QuizResponse } from "@/types/api/quiz/quiz.response";
import type { FillInAttemptResponse, MultipleChoiceAttemptResponse, WritingAttemptResponse } from "@/types/api/quiz/attempt.response";

export const getQuizService = async (quizId: number): Promise<QuizResponse> => {
    const data = await apiFetch<QuizApiResponse>(`/study-session/${quizId}/quiz`, {});
    return {
        studySession: data.studySession,
        quizData: data.quizData ?? data.quiz,
    } as QuizResponse;
};

// Quiz 1
export const submitMultipleChoiceService = async (
    sessionId: number,
    answers: number[]
) => {
    return apiFetch<MultipleChoiceAttemptResponse>(`/study-session/${sessionId}/attempt`, {
        method: "POST",
        body: JSON.stringify({ answers }),
    });
};

// Quiz 2
export const submitFillInService = async (
    sessionId: number,
    answers: string[][]
) => {
    return apiFetch<FillInAttemptResponse>(`/study-session/${sessionId}/attempt`, {
        method: "POST",
        body: JSON.stringify({ answers }),
    });
};

// Quiz 3
export const submitWritingService = async (
    sessionId: number,
    answers: string
) => {
    return apiFetch<WritingAttemptResponse>(`/study-session/${sessionId}/attempt`, {
        method: "POST",
        body: JSON.stringify({ answers }),
    });
};
