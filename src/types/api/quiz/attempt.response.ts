import {FillInQuestion, MultipleChoiceQuestion} from "@/types/api/quiz/quiz.response";

interface AttemptBase {
    id: number
    timingTag: 'T0' | 'T48'
    score: number
    maxPossibleScore: number
    iriValue: number | null
    completedAt: string
}

// Evaluacion QUiz 1
interface MultipleChoiceDetail {
    question: string
    userAnswer: number
    correctAnswer: number
    isCorrect: boolean
    explanation: string
}

interface MultipleChoiceFeedback {
    totalCorrect: number
    totalQuestions: number
    detail: MultipleChoiceDetail[]
}

// Evaluacion quiz 2
interface BlankResult {
    position: number
    userAnswer: string
    correctAnswer: string
    isCorrect: boolean
}

interface FillInDetail {
    paragraph: string
    blankResults: BlankResult[]
}

interface FillInFeedback {
    totalCorrect: number
    totalBlanks: number
    detail: FillInDetail[]
}

// Evaluacion quiz 3
interface EssayEvaluationResult {
    concepts_found: string[]
    concepts_missing: string[]
    relationships_identified: string[]
    feedback: string
}

interface WritingFeedback {
    score: number
    maxPossibleScore: number
    passed: boolean
    aiFeedback: EssayEvaluationResult
}

// Evaluaciones completas/armadas
export interface MultipleChoiceAttemptResponse {
    attempt: AttemptBase
    feedback: MultipleChoiceFeedback
    questions: MultipleChoiceQuestion[]
}

export interface FillInAttemptResponse {
    attempt: AttemptBase
    feedback: FillInFeedback
    questions: FillInQuestion[]
}

export interface WritingAttemptResponse {
    attempt: AttemptBase
    feedback: WritingFeedback
    questions: undefined
}

export type AttemptResponse = | MultipleChoiceAttemptResponse | FillInAttemptResponse | WritingAttemptResponse;