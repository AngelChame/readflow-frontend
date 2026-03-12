'use client';

import { HistoryAttempt } from "@/types/api/history.types";

interface Props {
    attempt: HistoryAttempt;
    evaluationType: string;
    timingLabel: string;
}

// types para eleccion multiple
interface MCDetail {
    question: string;
    isCorrect: boolean;
    explanation: string;
}
interface MCFeedback {
    totalCorrect: number;
    totalQuestions: number;
    detail: MCDetail[];
}

// types para rellenar espacios
interface BlankResult {
    position: number;
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
}
interface FillInParagraph {
    paragraph: string;
    blankResults: BlankResult[];
}
interface FillInFeedback {
    totalCorrect: number;
    totalBlanks: number;
    detail: FillInParagraph[];
}

// type para sintesis
interface WritingFeedback {
    passed: boolean;
    concepts_found: string[];
    concepts_missing: string[];
    relationships_identified: string[];
    feedback: string;
}

export default function HistoryAttemptResults({ attempt, evaluationType, timingLabel }: Props) {
    const isMultipleChoice = evaluationType === "Opción Múltiple";
    const isFillIn = evaluationType === "Completar Espacios (Drag and Drop)";
    const isWriting = evaluationType === "Redacción libre";

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-row items-center gap-3 flex-shrink-0">
                <h2 className="text-lg font-semibold text-foreground">{timingLabel}</h2>
                <span className="text-sm text-muted-foreground">
                    Completado el {new Date(attempt.completedAt).toLocaleDateString("es-MX")}
                </span>
            </div>

            {/* opcion multiple */}
            {isMultipleChoice && (() => {
                const feedback = attempt.feedback as MCFeedback;
                const total = feedback.totalQuestions;
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">
                                {feedback.totalCorrect >= Math.ceil(total * 0.6) ? '¡Bien hecho!' : 'Sigue practicando'}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Respondiste correctamente {feedback.totalCorrect} de {total} preguntas
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="rounded-xl border border-border bg-background p-4 text-center">
                                <p className="text-3xl font-bold text-green-500">{feedback.totalCorrect}</p>
                                <p className="text-sm text-muted-foreground mt-1">Correctas</p>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-4 text-center">
                                <p className="text-3xl font-bold text-red-400">{total - feedback.totalCorrect}</p>
                                <p className="text-sm text-muted-foreground mt-1">Incorrectas</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {feedback.detail.map((item, i) => (
                                <div key={i} className={`rounded-xl border p-4 ${item.isCorrect ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                    <div className="flex items-start gap-2">
                                        <span className={`font-bold text-sm ${item.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                            {item.isCorrect ? '✓' : '✗'}
                                        </span>
                                        <p className="text-sm font-medium text-foreground">{item.question}</p>
                                    </div>
                                    {!item.isCorrect && (
                                        <p className="text-xs text-muted-foreground mt-2 pl-4">{item.explanation}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* rellenar espacios */}
            {isFillIn && (() => {
                const feedback = attempt.feedback as FillInFeedback;
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">
                                {feedback.totalCorrect >= Math.ceil(feedback.totalBlanks * 0.6) ? '¡Bien hecho!' : 'Sigue practicando'}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Completaste {feedback.totalCorrect} de {feedback.totalBlanks} espacios correctamente
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-xl border border-border bg-background p-4 text-center">
                                <p className="text-3xl font-bold text-green-500">{feedback.totalCorrect}</p>
                                <p className="text-sm text-muted-foreground mt-1">Correctos</p>
                            </div>
                            <div className="rounded-xl border border-border bg-background p-4 text-center">
                                <p className="text-3xl font-bold text-red-400">{feedback.totalBlanks - feedback.totalCorrect}</p>
                                <p className="text-sm text-muted-foreground mt-1">Incorrectos</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {feedback.detail.map((item, qi) => (
                                <div key={qi} className="space-y-2">
                                    <p className="text-sm font-medium text-muted-foreground">Párrafo {qi + 1}</p>
                                    {item.blankResults.map((blank, bi) => (
                                        <div key={bi} className={`rounded-xl border p-3 flex items-center gap-3 ${blank.isCorrect ? 'border-green-500/30 bg-green-500/10' : 'border-red-500/30 bg-red-500/10'}`}>
                                            <span className={`font-bold text-sm ${blank.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                                {blank.isCorrect ? '✓' : '✗'}
                                            </span>
                                            <span className="text-sm text-foreground">
                                                Espacio {blank.position}: tu respuesta fue{' '}
                                                <strong>&#34;{blank.userAnswer || 'vacío'}&#34;</strong>
                                                {!blank.isCorrect && (
                                                    <> — correcta: <strong>&#34;{blank.correctAnswer}&#34;</strong></>
                                                )}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })()}

            {/* sintesis */}
            {isWriting && (() => {
                const feedback = attempt.feedback as WritingFeedback;
                return (
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-foreground">
                                {feedback.passed ? '¡Bien hecho!' : 'Sigue practicando'}
                            </h3>
                            <p className="text-muted-foreground text-sm mt-1">
                                Identificaste {feedback.concepts_found.length} conceptos clave
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
                                        <span key={i} className="px-3 py-1 rounded-full text-sm bg-green-500/10 border border-green-500/30 text-green-500">
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
                                        <span key={i} className="px-3 py-1 rounded-full text-sm bg-red-500/10 border border-red-500/30 text-red-400">
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
                    </div>
                );
            })()}
        </div>
    );
}