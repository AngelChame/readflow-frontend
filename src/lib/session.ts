import {cookies} from "next/headers";

export const SESSION_COOKIE = "session_token";

export async function getSessionToken():Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function isAuthenticated():Promise<boolean> {
    const token = await getSessionToken();
    return !!token;
}