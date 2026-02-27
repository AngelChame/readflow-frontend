'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WritingQuizResponse } from '@/types/api/quiz/quiz.response'
import { WritingAttemptResponse } from '@/types/api/quiz/attempt.response'
import { submitWritingService } from '@/services/quiz.service'

interface Props {
    data: WritingQuizResponse
}

const MIN_CHARS = 50

export default function WritingQuiz({ data }: Props) {
    const router = useRouter()
    const { studySession, quizData } = data
    const criteria = quizData.data.evaluation_criteria

    const [text, setText] = useState('')
    const [result, setResult] = useState<WritingAttemptResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [finished, setFinished] = useState(false)

    const canSubmit = text.trim().length >= MIN_CHARS

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await submitWritingService(studySession.id, text.trim())
            setResult(response)
            setFinished(true)
        } catch {
            setError('No se pudo enviar el quiz, intenta de nuevo')
        } finally {
            setLoading(false)
        }
    }
}