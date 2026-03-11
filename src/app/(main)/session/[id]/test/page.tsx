'use client';

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getQuizService } from '@/services/quiz.service'
import { QuizResponse, isMultipleChoice, isFillIn, isWriting } from '@/types/api/quiz/quiz.response'
import MultipleChoiceQuiz from '@/components/organisms/quiz/MultipleChoiceQuiz'
import FillInQuiz from '@/components/organisms/quiz/FillInQuiz'
import WritingQuiz from '@/components/organisms/quiz/WritingQuiz'
import { ApiError } from "@/services/api.service";
import {CircleAlert} from "lucide-react";

export default function TestPage() {
    const { id } = useParams()
    const router = useRouter()
    const [quiz, setQuiz] = useState<QuizResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [showUnavailableModal, setShowUnavailableModal] = useState(false)

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const data = await getQuizService(Number(id))

                if (!data || !data.quizData) {
                    setError('No se pudo cargar el quiz')
                    return
                }

                if (!data.quizData.available) {
                    setShowUnavailableModal(true)
                    return
                }

                setQuiz(data)
            } catch (e) {
                if (e instanceof ApiError && e.status === 404) {
                    router.push('/dashboard')
                } else if (e instanceof ApiError && e.status === 403) {
                    router.push('/dashboard')
                } else if (e instanceof ApiError && (e.status === 409 || e.status === 425)) {
                    setShowUnavailableModal(true)
                } else {
                    setError('No se pudo cargar el quiz')
                }
            } finally {
                setLoading(false)
            }
        }

        fetchQuiz()
    }, [id])

    if (showUnavailableModal) {
        return (
            <div className="w-full h-full bg-background flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-background-secondary rounded-2xl p-8 shadow-sm space-y-4 text-center flex flex-col items-center">
                    <CircleAlert></CircleAlert>
                    <h2 className="text-xl font-bold text-foreground">
                        Quiz no disponible
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Este quiz aún no está disponible o ya fue completado anteriormente.
                        Regresa cuando hayan pasado las 48 horas para completar tu repaso espaciado.
                    </p>
                    <button
                        onClick={() => router.push(`/session/${Number(id)}/summary`)}
                        className="w-full bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                        Ir al resumen
                    </button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Cargando quiz...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full h-full bg-background flex items-center justify-center">
                <p className="text-red-500 text-sm">{error}</p>
            </div>
        )
    }

    if (!quiz) return null

    if (isMultipleChoice(quiz)) return <MultipleChoiceQuiz data={quiz} />
    if (isFillIn(quiz)) return <FillInQuiz data={quiz} />
    if (isWriting(quiz)) return <WritingQuiz data={quiz} />

    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Tipo de quiz no reconocido</p>
        </div>
    )
}