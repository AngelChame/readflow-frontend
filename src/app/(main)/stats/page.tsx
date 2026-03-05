import { serverFetch } from "@/lib/api/server.fetch";
import StatsPageClient from "@/components/organisms/StatsPageClient";

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
  const streak = await getCurrentStreak();
  return <StatsPageClient streak={streak} />;
}