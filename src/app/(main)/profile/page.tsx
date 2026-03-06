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
    return { username: data.user?.username ?? "Usuario", email: data.user?.email ?? "" };
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
  const [userData, sessions] = await Promise.all([getUserData(), getRecentSessions()]);

  const name = userData?.username ?? "Usuario";
  const email = userData?.email ?? "";
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="grid grid-rows-[54%_44%] gap-4 h-full pt-6">

      <div className="relative bg-background-secondary rounded-2xl border border-border shadow-sm overflow-visible flex h-full">

        <div className="relative w-48 shrink-0">
          <div className="absolute top-40 -translate-y-1/2 left-20 w-100 h-100 rounded-full overflow-hidden border-4 border-background shadow-lg bg-background">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-main-purple/30 to-main-purple/10">
              <span className="text-5xl font-bold text-main-purple">{initials}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3 px-100 py-8 flex-1 relative">

          <button
            aria-label="Editar perfil"
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-main-purple text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <IconPencil size={15} />
          </button>

          <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
          <p className="text-sm text-foreground/60">Mejorando mi retención 📚</p>
          <div className="flex items-center gap-2 text-sm text-foreground">
            <IconAt size={14} className="text-foreground" />
            <span>{email}</span>
          </div>
        </div>

      </div>

      <div>
        <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm h-full overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-medium text-foreground">Últimas sesiones</h3>
          </div>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no tienes sesiones de estudio.</p>
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
