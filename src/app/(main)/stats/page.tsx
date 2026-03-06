import { serverFetch } from "@/lib/api/server.fetch";
import StatsPageClient from "@/components/organisms/StatsPageClient";
import { buildWeeklyChartData, buildSessionComparisonData } from "@/lib/stats.helpers";
import type { UserStatsResponse } from "@/types/api/stats.types";

async function getStats(): Promise<UserStatsResponse | null> {
  try {
    const res = await serverFetch("/stats/me");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function getCurrentStreak(): Promise<number> {
  try {
    const res = await serverFetch("/users/me");
    if (!res.ok) return 0;
    const data = await res.json();
    return data.streak?.currentStreak ?? 0;
  } catch {
    return 0;
  }
}

export default async function StatsPage() {
  const [streak, stats] = await Promise.all([getCurrentStreak(), getStats()]);

  const weeklyData = stats ? buildWeeklyChartData(stats.iriTimeline, stats.scoreComparison) : undefined;
  const comparisonData = stats ? buildSessionComparisonData(stats.scoreComparison) : undefined;

  return (
    <StatsPageClient
      streak={streak}
      weeklyData={weeklyData}
      comparisonData={comparisonData}
      bestIri={stats?.kpis.bestIri ?? null}
      sessionsCompleted={stats?.kpis.sessionsCompleted ?? 0}
    />
  );
}