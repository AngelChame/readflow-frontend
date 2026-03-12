import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server.fetch";

export async function GET() {
    try {
        const res = await serverFetch("/users/me");
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}
