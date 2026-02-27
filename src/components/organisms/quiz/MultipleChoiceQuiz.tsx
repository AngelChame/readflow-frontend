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

        )
    }

    return <p>A</p>
}