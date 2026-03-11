'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { HistorySessionDetail } from "@/types/api/history.types";
import { getHistorySessionService } from "@/services/history.service";

const menuTypes = ["Resumen", "Inmediato", "Espaciado"];

export default function HistorySessionPage() {
    const { id } = useParams();
    const [active, setActive] = useState(0);
    const [session, setSession] = useState<HistorySessionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                console.log(id);
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

            <div className="h-full p-16 bg-background-secondary  rounded-r-2xl flex flex-col">

                {/* Pestaña Resumen */}
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
                            <p className="text-foreground leading-relaxed">{session.summaryBody}</p>
                        </div>
                    </div>
                )}

                {/* Pestaña Inmediato */}
                {active === 1 && (
                    <div className="flex flex-col gap-4">
                        {session.attempts.t0 ? (
                            <>
                                <div className="flex flex-row items-center gap-3">
                                    <h2 className="text-lg font-semibold">Quiz Inmediato</h2>
                                    <span className="text-sm text-muted-foreground">
                                        Completado el {new Date(session.attempts.t0.completedAt).toLocaleDateString("es-MX")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-main-purple">
                                        {session.attempts.t0.score}
                                    </span>
                                    <span className="text-muted-foreground">
                                        / {session.attempts.t0.maxPossibleScore}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                Aún no has completado el quiz inmediato.
                            </p>
                        )}
                    </div>
                )}

                {/* Pestaña Espaciado */}
                {active === 2 && (
                    <div className="flex flex-col gap-4">
                        {session.attempts.t48 ? (
                            <>
                                <div className="flex flex-row items-center gap-3">
                                    <h2 className="text-lg font-semibold">Quiz Espaciado (48h)</h2>
                                    <span className="text-sm text-muted-foreground">
                                        Completado el {new Date(session.attempts.t48.completedAt).toLocaleDateString("es-MX")}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-3xl font-bold text-main-purple">
                                        {session.attempts.t48.score}
                                    </span>
                                    <span className="text-muted-foreground">
                                        / {session.attempts.t48.maxPossibleScore}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-sm">
                                El quiz espaciado aún no está disponible o no ha sido completado.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}