"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FillInQuizResponse } from "@/types/api/quiz/quiz.response";
import { FillInAttemptResponse } from "@/types/api/quiz/attempt.response";
import { submitFillInService } from "@/services/quiz.service";

const shuffleArray = <T,>(arr: T[]): T[] => {
  return [...arr].sort(() => Math.random() - 0.5);
};

interface Props {
  data: FillInQuizResponse;
}

export default function FillInQuiz({ data }: Props) {
  const router = useRouter();
  const { studySession, quizData } = data;
  const questions = useMemo(
    () =>
      quizData.data.questions.map((q) => ({
        ...q,
        word_bank: shuffleArray(q.word_bank),
      })),
    [],
  );

  const [answers, setAnswers] = useState<
    Record<number, Record<number, string>>
  >({});
  const [usedWords, setUsedWords] = useState<Record<number, Set<string>>>({});
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<FillInAttemptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);

  const q = questions[current];
  const total = questions.length;
  const currentAnswers = answers[current] ?? {};
  const currentUsed = usedWords[current] ?? new Set();

  const allBlanksFilledForCurrent = q.blanks.every(
    (_, i) => currentAnswers[i] !== undefined,
  );
  const allBlanksFilledAll = questions.every((question, qi) =>
    question.blanks.every((_, bi) => (answers[qi] ?? {})[bi] !== undefined),
  );

  const handleDropOnBlank = (blankIndex: number, word: string) => {
    const existing = currentAnswers[blankIndex];
    setAnswers((prev) => ({
      ...prev,
      [current]: { ...(prev[current] ?? {}), [blankIndex]: word },
    }));
    setUsedWords((prev) => {
      const prevSet = new Set(prev[current] ?? []);
      prevSet.add(word);
      if (existing) prevSet.delete(existing);
      return { ...prev, [current]: prevSet };
    });
  };

  const handleRemoveFromBlank = (blankIndex: number) => {
    const word = currentAnswers[blankIndex];
    if (!word) return;
    setAnswers((prev) => {
      const updated = { ...(prev[current] ?? {}) };
      delete updated[blankIndex];
      return { ...prev, [current]: updated };
    });
    setUsedWords((prev) => {
      const prevSet = new Set(prev[current] ?? []);
      prevSet.delete(word);
      return { ...prev, [current]: prevSet };
    });
  };

  const handleNext = () => {
    if (current + 1 < total) setCurrent((c) => c + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const answersArray = questions.map((question, qi) =>
        question.blanks.map((_, bi) => (answers[qi] ?? {})[bi] ?? ""),
      );
      const response = await submitFillInService(studySession.id, answersArray);
      setResult(response);
      setFinished(true);
    } catch {
      setError("No se pudo enviar el quiz, intenta de nuevo");
    } finally {
      setLoading(false);
    }
  };

  const renderParagraph = () => {
    const parts = q.paragraph.split("[BLANK]");
    return (
      <p className="text-foreground leading-relaxed text-base">
        {parts.map((part, i) => (
          <span key={i}>
            {part}
            {i < q.blanks.length && (
              <span
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragging) handleDropOnBlank(i, dragging);
                }}
                onClick={() => handleRemoveFromBlank(i)}
                className={`inline-block min-w-[100px] mx-1 px-3 py-0.3 rounded-md border-2 border-border-secondary text-sm font-medium transition-all cursor-pointer align-middle
                                    ${
                                      currentAnswers[i]
                                        ? "border-border-secondary bg-hover text-foreground"
                                        : "border-border bg-background text-transparent"
                                    }`}
              >
                {currentAnswers[i] || "___"}
              </span>
            )}
          </span>
        ))}
      </p>
    );
  };

  // Vista de resultados
  if (finished && result) {
    const { attempt, feedback } = result;

    return (
      <div className="w-full h-full flex flex-col justify-between bg-background-secondary rounded-2xl p-8 shadow-sm space-y-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {feedback.totalCorrect >= Math.ceil(feedback.totalBlanks * 0.6)
              ? "¡Bien hecho!"
              : "Sigue practicando"}
          </h1>
          <p className="text-muted-foreground mt-1">
            Completaste {feedback.totalCorrect} de {feedback.totalBlanks}{" "}
            espacios correctamente
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xl font-bold text-green-500">
              {feedback.totalCorrect}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Correctos</p>
          </div>
          <div className="rounded-xl border border-border bg-background p-4 text-center">
            <p className="text-xl font-bold text-red-400">
              {feedback.totalBlanks - feedback.totalCorrect}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Incorrectos</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {feedback.detail.map((item, qi) => (
            <div key={qi} className="space-y-1.5">
              <p className="text-sm font-medium text-muted-foreground">
                Párrafo {qi + 1}
              </p>
              {item.blankResults.map((blank, bi) => (
                <div
                  key={bi}
                  className={`rounded-xl border p-3 flex items-center gap-3 ${
                    blank.isCorrect
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <span
                    className={`font-bold text-sm ${blank.isCorrect ? "text-green-500" : "text-red-500"}`}
                  >
                    {blank.isCorrect ? "✓" : "✗"}
                  </span>
                  <span className="text-sm text-foreground">
                    Espacio {blank.position}: tu respuesta fue{" "}
                    <strong>&#34;{blank.userAnswer || "vacío"}&#34;</strong>
                    {!blank.isCorrect && (
                      <>
                        {" "}
                        — correcta:{" "}
                        <strong>&#34;{blank.correctAnswer}&#34;</strong>
                      </>
                    )}
                  </span>
                </div>
              ))}
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
            className="bg-summary-button text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
          >
            Volver al resumen
          </button>
        </div>
      </div>
    );
  }

  // Vista de quiz
  return (
    <div className="w-full h-full bg-background-secondary flex items-center justify-center rounded-2xl px-40">
      <div className="w-full space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {studySession.title}
          </h1>
          <p className="text-sm text-foreground mt-1">
            <span className="font-semibold">Instrucciones:</span> Completa el
            párrafo con las palabras en el recuadro.
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            <span className="font-semibold">Nota:</span> Se encuentran algunas
            palabras trampa.
          </p>
        </div>

        {/* Banco de palabras */}
        <div className="flex flex-wrap gap-2 justify-center">
          {q.word_bank.map((word) => {
            const isUsed = currentUsed.has(word);
            return (
              <div
                key={word}
                draggable={!isUsed}
                onDragStart={() => setDragging(word)}
                onDragEnd={() => setDragging(null)}
                className={`px-4 py-1.5 rounded-full border text-sm font-medium transition-all select-none
                                    ${
                                      isUsed
                                        ? "border-border bg-background text-muted-foreground cursor-not-allowed opacity-40"
                                        : "border-border bg-background text-foreground cursor-grab hover:bg-hover hover:border-border-secondary"
                                    }`}
              >
                {word}
              </div>
            );
          })}
        </div>

        {/* Párrafo con blanks */}
        <div className="rounded-xl bg-background border border-border p-5">
          {renderParagraph()}
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Haz clic en una palabra colocada para devolverla al banco
        </p>

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {/* Navegación */}
        <div className="flex justify-between gap-3 pt-2">
          {current + 1 < total ? (
            <button
              onClick={handleNext}
              disabled={!allBlanksFilledForCurrent}
              className="px-6 py-3 rounded-xl bg-summary-button text-white text-sm font-semibold hover:opacity-90 disabled:opacity-30 transition-opacity"
            >
              Siguiente
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allBlanksFilledAll || loading}
              className="px-6 py-3 rounded-xl bg-summary-button text-white text-sm font-semibold hover:opacity-90 disabled:opacity-30 transition-opacity"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
