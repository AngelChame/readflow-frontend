"use client";

import { usePathname } from "next/navigation";

export default function PageTitle() {
    const pathname = usePathname();

    const getDynamicTitle = () => {
        if (pathname.endsWith("/summary")) return "Resumen";
        if (pathname.endsWith("/test")) return "Test";

        const pageTitles: Record<string, string> = {
            "/dashboard": "Dashboard",
            "/history": "Historial",
            "/stats": "Estadísticas",
            "/profile": "Mi Perfil",
        };

        return pageTitles[pathname] || "ReadFlow";
    };

    return (
        <h1 className="text-2xl font-semibold text-foreground">
            {getDynamicTitle()}
        </h1>
    );
}
