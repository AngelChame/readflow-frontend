import HistoryCard, { HistoryCardData } from "@/components/molecules/HistoryCard";

// datos provisional
const dummySessions: HistoryCardData[] = Array.from({ length: 10 }, (_, i) => ({
  title: "La Ansiedad",
  date: "27/01/2026",
  retentionLevel: 85,
  summaryType: "Fácil",
  testType: "Opción Múltiple",
}));

export default function HistoryPage() {
  return (
    <div className="h-full">
      <div className="bg-background-secondary rounded-2xl border border-border shadow-sm p-6 h-full overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {dummySessions.map((session, index) => (
            <HistoryCard key={index} {...session} />
          ))}
        </div>
      </div>
    </div>
  );
}
