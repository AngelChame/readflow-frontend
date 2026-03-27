"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MultipleChoiceQuizResponse } from "@/types/api/quiz/quiz.response";
import { MultipleChoiceAttemptResponse } from "@/types/api/quiz/attempt.response";
import { submitMultipleChoiceService } from "@/services/quiz.service";

interface Props {
  data: MultipleChoiceQuizResponse;
}

export default function MultipleChoiceQuiz({ data }: Props) {
  const router = useRouter();
  const { studySession, quizData } = data;
  const questions = quizData.data.questions;
  const total = questions.length;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<MultipleChoiceAttemptResponse | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const q = questions[current];
  const selected = answers[current];
  const hasAnswer = selected !== undefined;
  const isLastQuestion = current + 1 === total;

  const handleSelect = (i: number) => {
    setAnswers((prev) => ({ ...prev, [current]: i }));
  };

  const handleNext = () => {
    if (!hasAnswer) return;
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrent((c) => c + 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const answersArray = Array.from(
        { length: total },
        (_, i) => answers[i] ?? -1,
      );
      const response = await submitMultipleChoiceService(
        studySession.id,
        answersArray,
      );
      setResult(response);
      setFinished(true);
    } catch {
      setError("No se pudo enviar el quiz, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  // Vista de resultados
  if (finished && result) {
    const { attempt, feedback } = result;

    return (
      <div className="w-full bg-background-secondary rounded-2xl p-4 sm:p-8 flex flex-col justify-between shadow-sm space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {feedback.totalCorrect >= Math.ceil(total * 0.6)
              ? "¡Bien hecho!"
              : "Sigue practicando"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Respondiste correctamente {feedback.totalCorrect} de{" "}
            {feedback.totalQuestions} preguntas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xl font-bold text-green-500">
              {feedback.totalCorrect}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Correctas</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xl font-bold text-red-400">
              {feedback.totalQuestions - feedback.totalCorrect}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Incorrectas</p>
          </div>
        </div>

        <div className="space-y-2">
          {feedback.detail.map((item, i) => (
            <div
              key={i}
              className={`rounded-xl border p-4 ${item.isCorrect ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"}`}
            >
              <div className="flex items-start gap-2">
                <span
                  className={`font-bold text-sm ${item.isCorrect ? "text-green-500" : "text-red-500"}`}
                >
                  {item.isCorrect ? "✓" : "✗"}
                </span>
                <p className="text-sm font-medium text-foreground">
                  {item.question}
                </p>
              </div>
              {!item.isCorrect && (
                <p className="text-xs text-muted-foreground mt-2 pl-4">
                  {item.explanation}
                </p>
              )}
            </div>
          ))}
        </div>

        {attempt.iriValue !== null && (
          <div className="rounded-xl border border-main-purple/30 bg-main-purple/10 p-4 text-center">
            <p className="text-sm text-main-purple">
              Índice de Retención (IRI)
            </p>
            <p className="text-2xl font-bold text-main-purple mt-1">
              {attempt.iriValue}%
            </p>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => router.push(`/session/${studySession.id}/summary`)}
            className="bg-summary-button text-white px-6 py-2 rounded-xl font-semibold hover:opacity-90 transition-opacity hover:cursor-pointer"
          >
            Volver al resumen
          </button>
        </div>
      </div>
    );
  }

  // Vista de quiz
  return (
    <div className="w-full h-full bg-background-secondary overflow-y-auto rounded-2xl px-4 sm:px-16 md:px-40 md:flex md:items-center md:justify-center">
      <div className="w-full space-y-6 py-6 md:pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {studySession.title}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Pregunta {current + 1} de {total}
          </p>
        </div>

        <p className="text-xl font-semibold text-foreground leading-snug">
          {q.question}
        </p>

        <div className="space-y-5">
          {q.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              className={`w-full text-left rounded-xl px-4 py-4 sm:px-5 sm:py-6 text-sm font-medium transition-all duration-300 border-2 hover:cursor-pointer
                ${
                  selected === i
                    ? "border-main-purple bg-main-purple/10 text-foreground shadow-[0_0_10px_var(--color-main-purple)]"
                    : "border-border bg-background hover:bg-hover text-foreground"
                }`}
            >
              {option}
            </button>
          ))}
        </div>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <div className="flex justify-between gap-3 pt-2">
          <button
            onClick={handleNext}
            disabled={!hasAnswer || loading}
            className="px-6 py-3 rounded-xl bg-summary-button text-white text-sm font-semibold hover:opacity-90 disabled:opacity-30 transition-opacity"
          >
            {loading
              ? "Enviando..."
              : isLastQuestion
                ? "Ver resultados"
                : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}
