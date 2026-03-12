import { LoginRequest, RegisterRequest, AuthResponse, ApiError } from "@/types/api/auth/auth.types";

async function post<T>(url: string, data?: unknown): Promise<T> {
    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: data ? JSON.stringify(data) : undefined,
    });

    const json = await res.json();
    if (!res.ok) throw json as ApiError;
    return json as T;
}

export const authClient = {
    login: (data: LoginRequest) =>
        post<AuthResponse>("/api/auth/login", data),

    register: (data: RegisterRequest) =>
        post<AuthResponse>("/api/auth/register", data),

    refresh: () =>
        post<{ ok: boolean }>("/api/auth/refresh"),

    logout: () =>
        post<{ message: string }>("/api/auth/logout"),
};