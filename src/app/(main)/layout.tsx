
import Sidebar from "@/components/organisms/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {/* Contenedor principal flex para dividir la pantalla */}
        <div className="flex h-screen w-full overflow-hidden">
          
          {/*Sidebar persistente */}
          <aside className="w-64 border-r bg-white dark:bg-slate-900">
            <Sidebar />
          </aside>

          {/* El contenido dinámico de rutas (Dashboard, Perfil, etc) */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-950 p-6">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}