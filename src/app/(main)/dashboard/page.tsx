import DropZone from "@/components/molecules/DropZone";
import StreakCard from "@/components/molecules/StreakCard";
import { WeeklyProgressChart } from "@/components/molecules/WeeklyProgressChart";
import { serverFetch } from "@/lib/api/server.fetch";

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

export default async function DashboardPage() {
  const currentStreak = await getCurrentStreak();
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

        <div className="flex items-center gap-8 justify-center mb-6">
          <select defaultValue="" className="text-base font-medium border border-border-secondary rounded-2xl px-4 py-2 text-foreground bg-background-secondary outline-none">
            <option value="" disabled>
              Selecciona el tipo de resumen
            </option>
            <option>Resumen fácil</option>
            <option>Resumen intermedio</option>
            <option>Resumen difícil</option>
          </select>
          <select defaultValue="" className="text-base font-medium border border-border-secondary rounded-2xl px-4 py-2 text-foreground bg-background-secondary outline-none">
            <option value="" disabled>
              Seleccione dificultad de la evaluación
            </option>
            <option>Fácil</option>
            <option>Intermedio</option>
            <option>Difícil</option>
          </select>
        </div>
        <div className="flex items-center justify-center">
          <DropZone />
        </div>
        <div className="flex items-center justify-center">
          <input type="submit" value="Generar" className="text-lg py-2 px-10 bg-blue-700 text-white font-bold rounded-xl mt-8 w-fit self-center cursor-pointer transition-all duration-300 hover:shadow-[0_5px_20px_rgba(91,106,235,0.7)] hover:scale-[1.02]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        <div className="bg-background-secondary p-6 rounded-2xl border border-border shadow-sm md:col-span-3 h-full overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <div>
              <h3 className="text-base font-medium text-foreground">
                Análisis semanal
              </h3>
            </div>
          </div>
          <div className="flex-1 min-h-0">
            <WeeklyProgressChart />
          </div>
        </div>

        <div className="md:col-span-1 h-full">
          <StreakCard streak={currentStreak} />
        </div>
      </div>
    </div>
  );
}