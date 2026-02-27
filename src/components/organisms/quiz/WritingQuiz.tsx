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

    if (finished && result) {
        const { attempt, feedback } = result
        const { aiFeedback } = feedback
        const passed = feedback.passed

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
                <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-sm space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {passed ? '¡Bien hecho!' : 'Sigue practicando'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Identificaste {aiFeedback.concepts_found.length} de {criteria.required_concepts.length} conceptos clave
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                            <p className="text-3xl font-bold text-green-500">{aiFeedback.concepts_found.length}</p>
                            <p className="text-sm text-gray-500 mt-1">Conceptos encontrados</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                            <p className="text-3xl font-bold text-red-400">{aiFeedback.concepts_missing.length}</p>
                            <p className="text-sm text-gray-500 mt-1">Conceptos faltantes</p>
                        </div>
                    </div>

                    {aiFeedback.concepts_found.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Conceptos identificados</p>
                            <div className="flex flex-wrap gap-2">
                                {aiFeedback.concepts_found.map((concept, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-sm bg-green-50 border border-green-200 text-green-700">
                                        {concept}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {aiFeedback.concepts_missing.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Conceptos que faltaron</p>
                            <div className="flex flex-wrap gap-2">
                                {aiFeedback.concepts_missing.map((concept, i) => (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-full text-sm bg-red-50 border border-red-200 text-red-600">
                                        {concept}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {aiFeedback.relationships_identified.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Relaciones identificadas</p>
                            <ul className="space-y-1">
                                {aiFeedback.relationships_identified.map((rel, i) => (
                                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                                        <span className="text-green-500 mt-0.5">✓</span>
                                        {rel}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Retroalimentación</p>
                        <p className="text-sm text-gray-600 leading-relaxed">{aiFeedback.feedback}</p>
                    </div>

                    {attempt.iriValue !== null && (
                        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-center">
                            <p className="text-sm text-indigo-500">Índice de Retención (IRI)</p>
                            <p className="text-3xl font-bold text-indigo-700 mt-1">{attempt.iriValue}%</p>
                        </div>
                    )}

                    <div className="flex justify-end">
                        <button
                            onClick={() => router.push(`/session/${studySession.id}/summary`)}
                            className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                            Volver al resumen
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-sm space-y-6">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{studySession.title}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        <span className="font-semibold">Instrucciones:</span> Redacta un texto de lo aprendido
                    </p>
                </div>

                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Entendí esto del tema porque...."
                    rows={8}
                    className="w-full rounded-xl bg-gray-50 border border-gray-100 px-5 py-4 text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-gray-300 transition-colors"/>

                <p className={`text-xs text-right ${canSubmit ? 'text-gray-400' : 'text-gray-300'}`}>
                    {text.trim().length} caracteres {!canSubmit && `(mínimo ${MIN_CHARS})`}
                </p>

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || loading}
                        className="bg-gray-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 disabled:opacity-30 transition-colors">
                        {loading ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </div>
        </div>
    )
}