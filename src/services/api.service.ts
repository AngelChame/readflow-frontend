const API_URL = process.env.NEXT_PUBLIC_API_URL;
const DEV_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export class ApiError extends Error {
    constructor(public status: number, message: string) {
        super(message)
    }
}

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
    const res = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DEV_TOKEN}`,
            ...options?.headers
        }
    })

    if (res.status === 401) {
        window.location.href = '/login?reason=session_expired'
        return
    }

    if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'Error desconocido' }))
        throw new ApiError(res.status, body.message)
    }

    return res.json()
}