import { cookies } from "next/headers";

export async function serverFetch(path: string, options?: RequestInit) {
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    const res = await fetch(`${process.env.EXTERNAL_API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options?.headers,
        },
    });

    return res;
}
