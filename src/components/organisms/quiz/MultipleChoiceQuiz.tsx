'use client';

import {useState} from "react";
import  {useRouter} from "next/navigation";
import {MultipleChoiceQuizResponse} from "@/types/api/quiz/quiz.response";
import {MultipleChoiceAttemptResponse} from "@/types/api/quiz/attempt.response";
import {submitMultipleChoiceService} from "@/services/quiz.service";

interface Props {
    data: MultipleChoiceQuizResponse;
}

type OptionState = 'idle' | 'selected' | 'correct' | 'wrong';
type QuizState = 'answering' | 'submitted' | 'finished';

export default function MultipleChoiceQuizComponent({data}:Props) {
    const router = useRouter();
    const {studySession, quizData} = data;
    const questions = quizData.data.questions;
    const total = questions.length;

    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({})
    const [quizState, setQuizState] = useState<QuizState>('answering')
    const [result, setResult] = useState<MultipleChoiceAttemptResponse | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const q = questions[current]
    const selected = answers[current]
    const hasAnswer = selected !== undefined

    const handleSelect = (i: number) => {
        if (quizState === 'submitted') return
        setAnswers((prev) => ({ ...prev, [current]: i }))
    }

    const handleNext = () => {
        if (quizState === 'answering') {
            if (!hasAnswer) return
            setQuizState('submitted')
            return
        }
        if (current + 1 < total) {
            setCurrent((c) => c + 1)
            setQuizState('answering')
        } else {
            handleSubmit()
        }
    }

    const handleBack = () => {
        if (quizState === 'submitted') {
            setQuizState('answering')
            return
        }
        if (current > 0) {
            setCurrent((c) => c - 1)
            setQuizState('answering')
        }
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError(null)
        try {
            const answersArray = Array.from({ length: total }, (_, i) => answers[i] ?? -1)
            const response = await submitMultipleChoiceService(studySession.id, answersArray)
            setResult(response)
            setQuizState('finished')
        } catch {
            setError('No se pudo enviar el quiz, intenta de nuevo')
            setQuizState('submitted')
        } finally {
            setLoading(false)
        }
    }

    const getOptionState = (i: number): OptionState => {
        if (quizState === 'answering') return selected === i ? 'selected' : 'idle'
        if (i === q.correct_answer) return 'correct'
        if (selected === i) return 'wrong'
        return 'idle'
    }

    const optionClass: Record<OptionState, string> = {
        idle: 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-800',
        selected: 'border border-indigo-300 bg-indigo-50 text-indigo-900',
        correct: 'border border-green-400 bg-green-50 text-green-800',
        wrong: 'border border-red-400 bg-red-50 text-red-800',
    }

    if (quizState === 'finished' && result) {
        const {attempt, feedback} = result;

        return (
            <div className="w-full h-full bg-gray-50 flex items-center justify-center p-6">
                <div className="w-full bg-white rounded-2xl p-8 shadow-sm space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {feedback.totalCorrect >= Math.ceil(total * 0.6) ? '¡Bien hecho!' : 'Sigue practicando'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Respondiste correctamente {feedback.totalCorrect} de {feedback.totalQuestions} preguntas
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                            <p className="text-3xl font-bold text-green-500">{feedback.totalCorrect}</p>
                            <p className="text-sm text-gray-500 mt-1">Correctas</p>
                        </div>
                        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-center">
                            <p className="text-3xl font-bold text-red-400">
                                {feedback.totalQuestions - feedback.totalCorrect}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">Incorrectas</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {feedback.detail.map((item, i) => (
                            <div key={i} className={`rounded-xl border p-4 ${item.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                                <div className="flex items-start gap-2">
                                    <span className={`font-bold text-sm ${item.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                                        {item.isCorrect ? '✓' : '✗'}
                                    </span>
                                    <p className="text-sm font-medium text-gray-800">{item.question}</p>
                                </div>
                                {!item.isCorrect && (
                                    <p className="text-xs text-gray-500 mt-2 pl-4">{item.explanation}</p>
                                )}
                            </div>
                        ))}
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
                    <p className="text-sm text-gray-500 mt-1">Pregunta {current + 1} de {total}</p>
                </div>

                <p className="text-xl font-semibold text-gray-900 leading-snug">{q.question}</p>

                <div className="space-y-3">
                    {q.options.map((option, i) => {
                        const state = getOptionState(i)
                        return (
                            <button
                                key={i}
                                onClick={() => handleSelect(i)}
                                disabled={quizState === 'submitted'}
                                className={`w-full text-left rounded-xl px-5 py-4 text-sm font-medium transition-all duration-150 cursor-pointer disabled:cursor-default ${optionClass[state]}`}>
                                {option}
                            </button>
                        )
                    })}
                </div>

                {quizState === 'submitted' && (
                    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                        <p className="text-sm text-gray-600 leading-relaxed">{q.explanation}</p>
                    </div>
                )}

                {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                <div className="flex justify-between gap-3 pt-2">
                    <button
                        onClick={handleBack}
                        disabled={current === 0 && quizState === 'answering'}
                        className="px-6 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-30 transition-colors">
                        Regresar
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!hasAnswer || loading}
                        className="px-6 py-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 disabled:opacity-30 transition-colors">
                        {loading ? 'Enviando...' : quizState === 'answering' ? 'Siguiente' : current + 1 === total ? 'Ver resultados' : 'Siguiente'}
                    </button>
                </div>
            </div>
        </div>
    )
}