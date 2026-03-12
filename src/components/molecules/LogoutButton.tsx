"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/api/auth.client";
import { IconLogout } from "@/components/atoms/icons/IconLogout";

export function LogoutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoading(true);
            await authClient.logout();
        } catch (error) {
            console.error("Error logging out", error);
        } finally {
            setIsLoading(false);
            // Forzamos el reemplazo a login para que no quede historial de navegacion,
            // y refrescamos para limpiar cualquier estado de RSC (React Server Components).
            router.replace("/login");
            router.refresh();
        }
    };

    return (
        <button
            onClick={handleLogout}
            disabled={isLoading}
            className="w-full flex items-center gap-3 p-2 text-foreground hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-base transition-colors group text-left"
        >
            <IconLogout className="w-6 h-6 text-foreground group-hover:text-red-500 transition-colors" />
            <span className="group-hover:text-red-500 transition-colors">
                {isLoading ? "Cerrando..." : "Cerrar sesión"}
            </span>
        </button>
    );
}
