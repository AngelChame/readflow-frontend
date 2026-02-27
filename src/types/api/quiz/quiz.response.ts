export interface StudySession {
    id: number
    title: string
    summaryBody: string
    difficultyLevel: string
    evaluationType: string
    createdAt: string
}

// Quiz 1
export interface MultipleChoiceQuestion {
    question: string
    options: string[]
    correct_answer: number
    explanation: string
}

export interface MultipleChoiceData {
    questions: MultipleChoiceQuestion[]
}

//Quiz 2
export interface Blank {
    position: number
    correct_answer: string
}

export interface FillInQuestion {
    paragraph: string
    blanks: Blank[]
    word_bank: string[]
}

export interface FillInData {
    questions: FillInQuestion[]
}


// Quiz 3
export interface EvaluationCriteria {
    required_concepts: string[]
    key_relationships: string[]
    minimum_concepts_to_pass: number
}

export interface WritingData {
    evaluation_criteria: EvaluationCriteria
}


// Response completas de cada tipo
export interface MultipleChoiceQuizResponse {
    studySession: StudySession
    quizData: {
        available: boolean
        timingTag: 'T0' | 'T48'
        data: MultipleChoiceData
    }
}

export interface FillInQuizResponse {
    studySession: StudySession
    quizData: {
        available: boolean
        timingTag: 'T0' | 'T48'
        data: FillInData
    }
}

export interface WritingQuizResponse {
    studySession: StudySession
    quizData: {
        available: boolean
        timingTag: 'T0' | 'T48'
        data: WritingData
    }
}

export type QuizResponse = MultipleChoiceQuizResponse | FillInQuizResponse | WritingQuizResponse;

// Type guards
export const isMultipleChoice = (quiz: QuizResponse): quiz is MultipleChoiceQuizResponse =>
    quiz.studySession.evaluationType === 'Opción Múltiple'

export const isFillIn = (quiz: QuizResponse): quiz is FillInQuizResponse =>
    quiz.studySession.evaluationType === 'Completar Espacios (Drag and Drop)'

export const isWriting = (quiz: QuizResponse): quiz is WritingQuizResponse =>
    quiz.studySession.evaluationType === 'Redacción libre'