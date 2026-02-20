import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">

      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">

        <div className="px-6 pt-6">
          <Header />
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          {children}
        </main>

      </div>

    </div>
  );
}