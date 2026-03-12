'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { HistorySessionDetail } from "@/types/api/history.types";
import { getHistorySessionService } from "@/services/history.service";
import { apiFetch } from "@/services/api.service";
import HistoryAttemptResults from "@/components/organisms/history/HistoryAttemptResults";
import Image from "next/image"
import brain from "@/../public/icons/brain.png"

const menuTypes = ["Resumen", "Inmediato", "Espaciado"];

interface T48Status {
    available: boolean;
    hoursRemaining?: number;
    scheduledFor?: string;
}

export default function HistorySessionPage() {
    const { id } = useParams();
    const router = useRouter();
    const [active, setActive] = useState(0);
    const [session, setSession] = useState<HistorySessionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [t48Status, setT48Status] = useState<T48Status | null>(null);
    const [t48Loading, setT48Loading] = useState(false);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const data = await getHistorySessionService(Number(id));
                setSession(data);
            } catch {
                setError("No se pudo cargar la sesión");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchSession();
    }, [id]);

    useEffect(() => {
        if (active !== 2 || !session) return;
        if (!session.attempts.t0 || session.attempts.t48) return;
        if (t48Status !== null) return;

        const fetchT48Status = async () => {
            setT48Loading(true);
            try {
                const data = await apiFetch<{ quiz?: { available: boolean; hoursRemaining?: number; scheduledFor?: string } }>(
                    `/study-session/${id}/quiz`
                );
                if (data.quiz) {
                    setT48Status({
                        available: data.quiz.available,
                        hoursRemaining: data.quiz.hoursRemaining,
                        scheduledFor: data.quiz.scheduledFor,
                    });
                }
            } catch {
                setT48Status({ available: false });
            } finally {
                setT48Loading(false);
            }
        };

        fetchT48Status();
    }, [active, session, id, t48Status]);

    if (loading) return null;

    if (error || !session) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className="text-red-500 text-sm">{error ?? "Sesión no encontrada"}</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex flex-col">
            <div className="h-fit flex flex-row space-x-2">
                {menuTypes.map((menuType, index) => (
                    <button
                        key={index}
                        onClick={() => setActive(index)}
                        className={`px-6 py-3 font-medium transition-colors duration-300 rounded-t-2xl ${
                            active === index
                                ? "text-font-secondary bg-summary-button hover:cursor-default"
                                : "text-font hover:cursor-pointer bg-background-secondary"
                        }`}
                    >
                        {menuType}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0 p-16 bg-background-secondary rounded-b-2xl rounded-r-2xl flex flex-col">

                {/*  resumen */}
                {active === 0 && (
                    <div className="flex flex-col gap-4 h-full">
                        <div className="flex flex-col gap-1 flex-shrink-0">
                            <h1 className="text-2xl font-bold text-foreground">{session.title}</h1>
                            <div className="flex flex-row gap-3 text-sm text-muted-foreground">
                                <span>{session.difficultyLevel}</span>
                                <span>·</span>
                                <span>{session.evaluationType}</span>
                                <span>·</span>
                                <span>{session.originalFilename}</span>
                            </div>
                        </div>
                        <div className="overflow-y-auto flex-1 min-h-0">
                            <div className="text-foreground flex flex-col gap-4">
                                {session.summaryBody.split('\n\n').map((paragraph, index) => (
                                    <p key={index} className="leading-relaxed">{paragraph}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* inmediato */}
                {active === 1 && (
                    <div className="flex flex-col h-full">
                        {session.attempts.t0 ? (
                            <div className="overflow-y-auto flex-1 min-h-0">
                                <HistoryAttemptResults
                                    attempt={session.attempts.t0}
                                    evaluationType={session.evaluationType}
                                    timingLabel="Quiz Inmediato (T0)"
                                />
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                                    <p className="text-foreground font-semibold text-lg">
                                        Aún no has realizado el quiz inmediato
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        Completa el quiz inmediato para ver tus resultados aquí.
                                    </p>
                                    <button
                                        onClick={() => router.push(`/session/${id}/test`)}
                                        className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Ir al quiz
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* espaciado */}
                {active === 2 && (
                    <div className="flex flex-col h-full">
                        {!session.attempts.t0 && (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                                    <p className="text-foreground font-semibold text-lg">
                                        Primero debes completar el quiz inmediato
                                    </p>
                                    <p className="text-muted-foreground text-sm">
                                        El quiz espaciado se activa 48 horas después de completar el quiz inmediato.
                                    </p>
                                    <button
                                        onClick={() => router.push(`/session/${id}/test`)}
                                        className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                    >
                                        Ir al quiz inmediato
                                    </button>
                                </div>
                            </div>
                        )}

                        {session.attempts.t0 && !session.attempts.t48 && (
                            <div className="flex-1 flex items-center justify-center">
                                {t48Loading ? (
                                    <p className="text-muted-foreground text-sm">Cargando...</p>
                                ) : (
                                    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
                                        <Image src={brain} height={60} alt={"Cerebro"}></Image>
                                        <p className="text-foreground font-semibold text-lg">
                                            {t48Status?.available
                                                ? "¡El quiz espaciado está disponible!"
                                                : t48Status?.hoursRemaining !== undefined
                                                    ? `Vuelve en ${t48Status.hoursRemaining} hrs para poder realizar la evaluación espaciada.`
                                                    : "El quiz espaciado aún no está disponible."
                                            }
                                        </p>
                                        {t48Status?.available && (
                                            <button
                                                onClick={() => router.push(`/session/${id}/test`)}
                                                className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
                                            >
                                                Realizar quiz espaciado
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {session.attempts.t48 && (
                            <div className="overflow-y-auto flex-1 min-h-0">
                                <HistoryAttemptResults
                                    attempt={session.attempts.t48}
                                    evaluationType={session.evaluationType}
                                    timingLabel="Quiz Espaciado (T48)"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}