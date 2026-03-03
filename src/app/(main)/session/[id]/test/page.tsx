'use client';

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getQuizService } from '@/services/quiz.service'
import { QuizResponse, isMultipleChoice, isFillIn, isWriting } from '@/types/api/quiz/quiz.response'
import MultipleChoiceQuiz from '@/components/organisms/quiz/MultipleChoiceQuiz'
import FillInQuiz from '@/components/organisms/quiz/FillInQuiz'
import WritingQuiz from '@/components/organisms/quiz/WritingQuiz'

export default function TestPage() {
    const { id } = useParams()
    const [quiz, setQuiz] = useState<QuizResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizService(Number(id))
                setQuiz(data)
            } catch {
                setError('No se pudo cargar el quiz')
            } finally {
                setLoading(false)
            }
        }

        fetchQuiz()
    }, [id])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm">Cargando quiz...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        )
    }

    if (!quiz) return null

    if (isMultipleChoice(quiz)) return <MultipleChoiceQuiz data={quiz} />
    if (isFillIn(quiz)) return <FillInQuiz data={quiz} />
    if (isWriting(quiz)) return <WritingQuiz data={quiz} />

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <p className="text-gray-500 text-sm">Tipo de quiz no reconocido</p>
        </div>
    )
}