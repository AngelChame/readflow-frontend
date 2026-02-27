"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
    ThemeToggler,
    type ThemeSelection,
    type Resolved,
} from "@/components/animate-ui/primitives/effects/theme-toggler";

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Skeleton mientras hidrata
    if (!mounted) {
        return (
            <div className="w-16 h-8 rounded-full bg-gray-200 animate-pulse" />
        );
    }

    return (
        <ThemeToggler
            theme={theme as ThemeSelection}
            resolvedTheme={resolvedTheme as Resolved}
            setTheme={setTheme}
            direction="ltr"
        >
            {({ effective, toggleTheme }) => {
                const isDark = effective === "dark";
                return (
                    <button
                        onClick={() => toggleTheme(isDark ? "light" : "dark")}
                        role="switch"
                        aria-checked={isDark}
                        aria-label="Toggle theme"
                        className={[
                            "relative inline-flex items-center w-16 h-8 rounded-full",
                            "transition-colors duration-300 focus:outline-none",
                            isDark ? "bg-[#5B5BD6]" : "bg-gray-300",
                        ].join(" ")}
                    >
                        {/* Thumb deslizante */}
                        <span
                            className={[
                                "absolute flex items-center justify-center",
                                "w-7 h-7 rounded-full bg-white shadow-sm",
                                "transition-transform duration-300",
                                isDark ? "translate-x-8" : "translate-x-1",
                            ].join(" ")}
                        >
                            {isDark ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                    viewBox="0 0 24 24" fill="none" stroke="#5B5BD6"
                                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                    viewBox="0 0 24 24" fill="none" stroke="#6b7280"
                                    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="4" />
                                    <path d="M12 2v2" />
                                    <path d="M12 20v2" />
                                    <path d="m4.93 4.93 1.41 1.41" />
                                    <path d="m17.66 17.66 1.41 1.41" />
                                    <path d="M2 12h2" />
                                    <path d="M20 12h2" />
                                    <path d="m6.34 17.66-1.41 1.41" />
                                    <path d="m19.07 4.93-1.41 1.41" />
                                </svg>
                            )}
                        </span>
                    </button>
                );
            }}
        </ThemeToggler>
    );
}

