'use client';

import Image from "next/image"
import brain from "@/../public/icons/brainModal.png"

interface Props {
    title: string;
    description?: string;
    buttonText?: string;
    onAction?: () => void;
    showBrain?: boolean;
    minutesRemaining?: number;
}

function formatHour(totalMinutes: number): string {
    const hours: number = Math.floor(totalMinutes / 60);
    const minutes: number = totalMinutes % 60;
    const hoursStr = String(hours).padStart(2, '0');
    const minutesStr = String(minutes).padStart(2, '0');
    return `${hoursStr}:${minutesStr}`;
}

export default function HistoryQuizModal({ title, description, buttonText, onAction, showBrain, minutesRemaining }: Props) {
    const displayTitle = minutesRemaining !== undefined
        ? `Vuelve en ${formatHour(minutesRemaining)} hrs para poder realizar la evaluación espaciada.`
        : title;

    return (
        <div className="absolute inset-0 backdrop-blur-sm flex items-center justify-center rounded-b-2xl rounded-r-2xl">
            <div className="bg-background-secondary border border-border rounded-2xl shadow-lg p-8 flex flex-col items-center text-center gap-4 max-w-sm w-full mx-4">
                {showBrain && (
                    <Image src={brain} alt="brain" className="w-16 h-16 object-contain" />
                )}
                <p className="text-foreground font-semibold text-base leading-snug">
                    {displayTitle}
                </p>
                {description && (
                    <p className="text-muted-foreground text-sm">{description}</p>
                )}
                {buttonText && onAction && (
                    <button
                        onClick={onAction}
                        className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity w-full"
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
}