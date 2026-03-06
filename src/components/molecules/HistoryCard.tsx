import Link from "next/link";
import { IconBookRibbon } from "@/components/atoms/icons/IconBookRibbon";
import { IconCheck } from "@/components/atoms/icons/IconCheck";
import { IconQuizz } from "@/components/atoms/icons/IconQuizz";
import type { SessionStatus } from "@/types/api/history.types";

export interface HistoryCardData {
    id: number;
    title: string;
    date: string;
    retentionLevel: number | null;
    summaryType: string;
    testType: string;
    status: SessionStatus;
}

function StatusBadge({ status, retentionLevel }: { status: SessionStatus; retentionLevel: number | null }) {
    if (status === "completed" && retentionLevel !== null) {
        return (
            <span className="flex items-center gap-1 shrink-0 bg-[#5B5BD6] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                <IconCheck className="w-3 h-3" />
                {retentionLevel}%
            </span>
        );
    }
    if (status === "t0_completed") {
        return (
            <span className="flex items-center gap-1 shrink-0 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                En repaso
            </span>
        );
    }
    return (
        <span className="flex items-center gap-1 shrink-0 bg-gray-400 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Pendiente
        </span>
    );
}

export default function HistoryCard({
    id,
    title,
    date,
    retentionLevel,
    summaryType,
    testType,
    status,
}: HistoryCardData) {
    return (
        <Link href={`/session/${id}/summary`}>
            <div className="bg-background-secondary border border-out-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 h-full cursor-pointer">

                <div className="flex items-start justify-between gap-2 mb-10">
                    <div>
                        <p className="text-sm font-semibold text-foreground leading-tight">
                            {title}
                        </p>
                        <p className="text-xs text-foreground/50 mt-0.5">{date}</p>
                    </div>
                    <StatusBadge status={status} retentionLevel={retentionLevel} />
                </div>

                <hr className="border-border" />

                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 text-xs text-foreground/70">
                        <IconBookRibbon className="shrink-0" />
                        <span>{summaryType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-foreground/70">
                        <IconQuizz className="shrink-0" />
                        <span>{testType}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
