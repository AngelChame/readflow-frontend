import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server.fetch";
import { cookies } from "next/headers";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;
        console.log("Token encontrado:", !!token);

        const externalRes = await serverFetch(`/api/v1/study-session/${id}/history`);

        const data = await externalRes.json();

        if (!externalRes.ok) {
            return NextResponse.json({ message: data.message }, { status: externalRes.status });
        }

        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}