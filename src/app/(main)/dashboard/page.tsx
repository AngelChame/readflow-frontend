import StreakCard from "@/components/molecules/StreakCard";
import { WeeklyProgressChart } from "@/components/molecules/WeeklyProgressChart";
import DashboardForm from "@/components/organisms/DashboardForm";
import { serverFetch } from "@/lib/api/server.fetch";
import { buildWeeklyChartData } from "@/lib/stats.helpers";
import type { CatalogsData } from "@/types/api/catalogs.types";
import type { UserStatsResponse } from "@/types/api/stats.types";

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

async function getCatalogs(): Promise<CatalogsData> {
  try {
    const res = await serverFetch("/catalogs");
    if (!res.ok) return { difficulties: [], evaluationTypes: [] };
    const json = await res.json();
    return json.data as CatalogsData;
  } catch {
    return { difficulties: [], evaluationTypes: [] };
  }
}

async function getStats(): Promise<UserStatsResponse | null> {
  try {
    const res = await serverFetch("/stats/me");
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const [currentStreak, catalogs, stats] = await Promise.all([
    getCurrentStreak(),
    getCatalogs(),
    getStats(),
  ]);

  const chartData = stats
    ? buildWeeklyChartData(stats.iriTimeline, stats.scoreComparison)
    : undefined;

  return (
    <div className="grid grid-rows-[64%_33%] gap-4 h-full">
      <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm w-full h-full overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-medium text-foreground">
              Personaliza tu aprendizaje
            </h3>
          </div>
        </div>

        <DashboardForm catalogs={catalogs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        <div className="hidden md:flex bg-background-secondary p-6 rounded-2xl border border-border shadow-sm md:col-span-3 h-full overflow-hidden flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-base font-medium text-foreground">
                Análisis semanal
              </h3>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <WeeklyProgressChart data={chartData} />
          </div>
        </div>

        <div className="md:col-span-1 h-full">
          <StreakCard streak={currentStreak} />
        </div>
      </div>
    </div>
  );
}
