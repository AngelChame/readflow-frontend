"use client";

import { usePathname } from "next/navigation";
import UserWidget from "@/components/molecules/UserWidget";

export default function Header() {
  const pathname = usePathname();

  // Función para determinar el título de forma dinámica
  const getDynamicTitle = () => {
    // Usamos expresiones regulares o simplemente verificamos el final de la ruta
    if (pathname.endsWith("/summary")) return "Resumen";
    if (pathname.endsWith("/test")) return "Evaluación";

    // Diccionario para rutas estáticas
    const pageTitles: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/history": "Historial",
      "/stats": "Estadísticas",
      "/profile": "Mi Perfil",
    };

    return pageTitles[pathname] || "ReadFlow";
  };

  return (
    <header className="flex items-center justify-between w-full ">
      <h1 className="text-2xl font-semibold text-foreground">
        {getDynamicTitle()}
      </h1>

      <UserWidget name="Luis Pérez" />
    </header>
  );
}