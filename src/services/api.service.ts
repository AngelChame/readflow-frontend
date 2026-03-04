export class ApiError extends Error {
    constructor(public status: number, message: string, public errors?: Record<string, string[]>) {
        super(message);
    }
}

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

async function attemptRefresh(): Promise<boolean> {
    if (isRefreshing && refreshPromise) return refreshPromise;

    isRefreshing = true;
    refreshPromise = fetch("/api/auth/refresh", { method: "POST" })
        .then((res) => res.ok)
        .catch(() => false)
        .finally(() => {
            isRefreshing = false;
            refreshPromise = null;
        });

    return refreshPromise;
}

interface FetchOptions extends RequestInit {
    _retry?: boolean;
}

export const apiFetch = async <T = unknown>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<T> => {
    const { _retry, ...fetchOptions } = options;

    const res = await fetch(`/api${endpoint}`, {
        ...fetchOptions,
        headers: {
            "Content-Type": "application/json",
            ...fetchOptions.headers,
        },
        credentials: "include",
    });

    if (res.ok) {
        return res.json() as Promise<T>;
    }

    // refesh de token
    const isAuthRoute = endpoint.startsWith("/auth/");

    if (res.status === 401 && !_retry && !isAuthRoute) {
        const refreshed = await attemptRefresh();

        if (refreshed) {
            return apiFetch<T>(endpoint, { ...options, _retry: true });
        }

        window.location.href = "/login?reason=session_expired";
        throw new ApiError(401, "Sesión expirada");
    }

    const body = await res.json().catch(() => ({ message: "Error desconocido" }));
    throw new ApiError(res.status, body.message, body.errors);
};
