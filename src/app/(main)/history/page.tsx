import { serverFetch } from "@/lib/api/server.fetch";
import HistoryCard from "@/components/molecules/HistoryCard";
import type { StudySessionSummary } from "@/types/api/history.types";

async function getSessions(): Promise<StudySessionSummary[]> {
  try {
    const res = await serverFetch("/study-sessions");
    if (!res.ok) return [];
    const data = await res.json();
    return data.sessions ?? [];
  } catch {
    return [];
  }
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function HistoryPage() {
  const sessions = await getSessions();

  return (
    <div className="h-full">
      <div className="bg-background-secondary rounded-2xl border border-border shadow-sm p-6 h-full overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              Aún no tienes sesiones de estudio. ¡Sube un documento para comenzar!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
            {sessions.map((session) => (
              <HistoryCard
                key={session.id}
                id={session.id}
                title={session.title}
                date={formatDate(session.createdAt)}
                retentionLevel={session.retention}
                summaryType={session.difficultyLevel}
                testType={session.evaluationType}
                status={session.status}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
