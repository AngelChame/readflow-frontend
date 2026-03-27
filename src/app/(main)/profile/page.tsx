import HistoryCard from "@/components/molecules/HistoryCard";
import { IconPencil } from "@/components/atoms/icons/IconPencil";
import { IconAt } from "@/components/atoms/icons/IconArroba";
import { serverFetch } from "@/lib/api/server.fetch";
import type { StudySessionSummary } from "@/types/api/history.types";

interface UserData {
  username: string;
  email: string;
}

async function getUserData(): Promise<UserData | null> {
  try {
    const res = await serverFetch("/users/me");
    if (!res.ok) return null;
    const data = await res.json();
    return {
      username: data.user?.username ?? "Usuario",
      email: data.user?.email ?? "",
    };
  } catch {
    return null;
  }
}

async function getRecentSessions(): Promise<StudySessionSummary[]> {
  try {
    const res = await serverFetch("/study-sessions");
    if (!res.ok) return [];
    const data = await res.json();
    return (data.sessions ?? []).slice(0, 4);
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

export default async function ProfilePage() {
  const [userData, sessions] = await Promise.all([
    getUserData(),
    getRecentSessions(),
  ]);

  const name = userData?.username ?? "Usuario";
  const email = userData?.email ?? "";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col gap-4 h-full pt-6 md:grid md:grid-rows-[54%_44%]">
      <div className="relative bg-background-secondary rounded-2xl border border-border shadow-sm overflow-visible flex flex-col md:flex-row h-full">
        <div className="flex justify-center pt-8 md:pt-0 md:relative md:w-48 md:shrink-0">
          <div className="w-36 h-36 md:w-100 md:h-100 rounded-full overflow-hidden border-4 border-background shadow-lg bg-background md:absolute md:top-44 md:-translate-y-1/2 md:left-20">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-main-purple/30 to-main-purple/10">
              <span className="text-5xl md:text-5xl font-bold text-main-purple">
                {initials}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center gap-3 px-6 py-6 md:px-100 md:py-8 flex-1 relative text-center md:text-left items-center md:items-start">
          <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
          <p className="text-sm text-foreground/60">
            Mejorando mi retención 📚
          </p>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <IconAt size={14} className="text-foreground" />
            <span>{email}</span>
          </div>
        </div>
      </div>

      <div>
        <div className="bg-background-secondary p-6 pb-24 md:pb-6 rounded-2xl border border-border shadow-sm h-full overflow-y-auto">
          {" "}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-foreground">
              Últimas sesiones
            </h3>
          </div>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aún no tienes sesiones de estudio.
            </p>
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
    </div>
  );
}
