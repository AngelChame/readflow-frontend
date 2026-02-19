
import Sidebar from "@/components/organisms/Sidebar";

export default function MaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        {/* Contenedor principal flex para dividir la pantalla */}
        <div className="flex h-screen w-full overflow-hidden">
          
          <Sidebar />

          {/* El contenido dinámico de rutas (Dashboard, Perfil, etc) */}
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
          
        </div>
      </body>
    </html>
  );
}