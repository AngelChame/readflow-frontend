import { IconBookRibbon } from "@/components/atoms/icons/IconBookRibbon";
import { IconCheck } from "@/components/atoms/icons/IconCheck";
import { IconQuizz } from "@/components/atoms/icons/IconQuizz";

export interface HistoryCardData {
    title: string;
    date: string;
    retentionLevel: number;
    summaryType: string;
    testType: string;
}

export default function HistoryCard({
    title,
    date,
    retentionLevel,
    summaryType,
    testType,
}: HistoryCardData) {
    return (
        <div className="bg-background-secondary border border-out-border rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200 h-full">

            <div className="flex items-start justify-between gap-2 mb-10">
                <div>
                    <p className="text-sm font-semibold text-foreground leading-tight">
                        {title}
                    </p>
                    <p className="text-xs text-foreground/50 mt-0.5">{date}</p>
                </div>
                <span className="flex items-center gap-1 shrink-0 bg-[#5B5BD6] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    <IconCheck className="w-3 h-3" />
                    {retentionLevel}%
                </span>
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
    );
}
