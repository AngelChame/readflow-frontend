import { serverFetch } from "@/lib/api/server.fetch";
import HistoryCard from "@/components/molecules/HistoryCard";
import type { StudySessionSummary } from "@/types/api/history.types";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const LIMIT = 12;

interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface SessionsResponse {
  sessions: StudySessionSummary[];
  pagination: Pagination;
}

async function getSessions(page: number): Promise<SessionsResponse> {
  try {
    const res = await serverFetch(
      `/study-sessions?page=${page}&limit=${LIMIT}`,
    );
    if (!res.ok)
      return {
        sessions: [],
        pagination: {
          total: 0,
          totalPages: 0,
          currentPage: page,
          limit: LIMIT,
          hasNextPage: false,
          hasPrevPage: false,
        },
      };
    return await res.json();
  } catch {
    return {
      sessions: [],
      pagination: {
        total: 0,
        totalPages: 0,
        currentPage: page,
        limit: LIMIT,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { sessions, pagination } = await getSessions(page);

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="bg-background-secondary rounded-2xl border border-border shadow-sm p-6 flex-1 min-h-0 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-sm">
              Aún no tienes sesiones de estudio. ¡Sube un documento para
              comenzar!
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

      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 flex-shrink-0">
          {pagination.hasPrevPage ? (
            <Link
              href={`?page=${page - 1}`}
              className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Link>
          ) : (
            <span className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold opacity-40 cursor-not-allowed flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </span>
          )}

          <span className="text-sm text-muted-foreground">
            Página {pagination.currentPage} de {pagination.totalPages}
          </span>

          {pagination.hasNextPage ? (
            <Link
              href={`?page=${page + 1}`}
              className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="bg-summary-button text-white px-6 py-3 rounded-xl font-semibold opacity-40 cursor-not-allowed flex items-center gap-2">
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
