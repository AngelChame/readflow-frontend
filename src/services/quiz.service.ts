import {apiFetch} from "@/services/api.service";

export const getQuizService = async (quizId: number) => {
    const data = await apiFetch(`/study-session/${quizId}/quiz`, {})

    if (data.quiz) {
        return {
            ...data,
            quizData: data.quiz,
            quiz: undefined
        }
    }

    return data
}

// Quiz 1
export const submitMultipleChoiceService = async (
    sessionId: number,
    answers: number[]
) => {
    return apiFetch(`/study-session/${sessionId}/attempt`, {
        method: 'POST',
        body: JSON.stringify({ answers })
    })
}

// Quiz 2
export const submitFillInService = async (
    sessionId: number,
    answers: string[][]
) => {
    return apiFetch(`/study-session/${sessionId}/attempt`, {
        method: 'POST',
        body: JSON.stringify({ answers })
    })
}

// Quiz 3
export const submitWritingService = async (
    sessionId: number,
    answers: string
) => {
    return apiFetch(`/study-session/${sessionId}/attempt`, {
        method: 'POST',
        body: JSON.stringify({ answers })
    })
}