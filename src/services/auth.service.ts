import { authClient } from "@/lib/api/auth.client";
import type { User } from "@/types/api/auth/auth.types";
import {apiFetch} from "@/services/api.service";

export const loginService = async (email: string, password: string) => {
    return authClient.login({ email, password });
};

export const registerService = async (username: string, email: string, password: string) => {
    return authClient.register({ username, email, password });
};

export const getMeService = async (): Promise<User | null> => {
    return apiFetch<User>("/auth/me").catch(() => null);
};