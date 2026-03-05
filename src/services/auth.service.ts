import { apiFetch } from "@/services/api.service";
import type { User } from "@/types/api/auth/auth.types";

export const loginService = async (email: string, password: string) => {
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
};

export const registerService = async (username: string, email: string, password: string) => {
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
    });
};

export const getMeService = async (): Promise<User | null> => {
    return apiFetch<User>("/auth/me").catch(() => null);
};
