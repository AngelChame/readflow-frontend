import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server.fetch";

export async function POST() {
    try {
        const res = await serverFetch("/auth/refresh", { method: "POST" });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        const { accessToken } = data;

        const response = NextResponse.json({ ok: true }, { status: 200 });

        response.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 15,
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}
