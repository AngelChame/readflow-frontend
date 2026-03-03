'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { WritingQuizResponse } from '@/types/api/quiz/quiz.response'
import { WritingAttemptResponse } from '@/types/api/quiz/attempt.response'
import { submitWritingService } from '@/services/quiz.service'

interface Props {
    data: WritingQuizResponse
}

const MIN_CHARS = 150

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
            console.log('Writing response:', JSON.stringify(response, null, 2)) // ← agrega esto
            setResult(response)
            setFinished(true)
        } catch {
            setError('No se pudo enviar el quiz, intenta de nuevo')
        } finally {
            setLoading(false)
        }
    }

    // Vista de resultados
    if (finished && result) {
        const { attempt, feedback } = result
        const passed = feedback.passed

        return (
            <div className="w-full h-full bg-background-secondary rounded-2xl p-8 shadow-sm space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        {passed ? '¡Bien hecho!' : 'Sigue practicando'}
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Identificaste {feedback.concepts_found.length} de {criteria.required_concepts.length} conceptos clave
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                        <p className="text-3xl font-bold text-green-500">{feedback.concepts_found.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">Conceptos encontrados</p>
                    </div>
                    <div className="rounded-xl border border-border bg-background p-4 text-center">
                        <p className="text-3xl font-bold text-red-400">{feedback.concepts_missing.length}</p>
                        <p className="text-sm text-muted-foreground mt-1">Conceptos faltantes</p>
                    </div>
                </div>

                {feedback.concepts_found.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Conceptos identificados</p>
                        <div className="flex flex-wrap gap-2">
                            {feedback.concepts_found.map((concept, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-sm bg-green-500/10 border border-green-500/30 text-green-500">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {feedback.concepts_missing.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Conceptos que faltaron</p>
                        <div className="flex flex-wrap gap-2">
                            {feedback.concepts_missing.map((concept, i) => (
                                <span
                                    key={i}
                                    className="px-3 py-1 rounded-full text-sm bg-red-500/10 border border-red-500/30 text-red-400">
                                    {concept}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {feedback.relationships_identified.length > 0 && (
                    <div className="space-y-2">
                        <p className="text-sm font-semibold text-foreground">Relaciones identificadas</p>
                        <ul className="space-y-1">
                            {feedback.relationships_identified.map((rel, i) => (
                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                    <span className="text-green-500 mt-0.5">✓</span>
                                    {rel}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="rounded-xl bg-background border border-border p-4">
                    <p className="text-sm font-semibold text-foreground mb-1">Retroalimentación</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feedback.feedback}</p>
                </div>

                {attempt.iriValue !== null && (
                    <div className="rounded-xl border border-main-purple/30 bg-main-purple/10 p-4 text-center">
                        <p className="text-sm text-main-purple">Índice de Retención (IRI)</p>
                        <p className="text-3xl font-bold text-main-purple mt-1">{attempt.iriValue}%</p>
                    </div>
                )}

                <div className="flex justify-end">
                    <button
                        onClick={() => router.push(`/session/${studySession.id}/summary`)}
                        className="bg-summary-button text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                        Volver al resumen
                    </button>
                </div>
            </div>
        )
    }

    // Vista de quiz
    return (
        <div className="w-full h-full bg-background-secondary flex items-center justify-center rounded-2xl px-40">
            <div className="w-full space-y-6 py-8">

                <div>
                    <h1 className="text-2xl font-bold text-foreground">{studySession.title}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">Instrucciones:</span> Redacta un texto de lo aprendido
                    </p>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entendí esto del tema porque...."
                    rows={8}
                    className="w-full rounded-xl bg-background border border-border px-5 py-4 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-border-secondary transition-colors"/>

                <p className={`text-xs text-right ${canSubmit ? 'text-muted-foreground' : 'text-muted-foreground/40'}`}>
                    {text.trim().length} caracteres {!canSubmit && `(mínimo ${MIN_CHARS})`}
                </p>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || loading}
                        className="bg-summary-button text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-30 transition-opacity">
                        {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    )
}