import { apiFetch } from "@/services/api.service";

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
