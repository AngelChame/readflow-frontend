import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";
import { serverFetch } from "@/lib/api/server.fetch";
import type { User } from "@/types/api/auth/auth.types";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ReadFlow",
};

async function getUser(): Promise<User | null> {
  try {
    const res = await serverFetch("/users/me");
    if (!res.ok) return null;
    const data = await res.json();
    return (data.user ?? data) as User;
  } catch {
    return null;
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden space-y-2">
        <div className="px-6 pt-6">
          <Header user={user} />
        </div>

        <main className="flex-1 overflow-y-auto p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-4 pt-[env(safe-area-inset-top)] md:pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
