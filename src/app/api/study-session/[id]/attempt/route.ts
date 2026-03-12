import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server.fetch";

export async function POST(
    req: NextRequest,
    { params }: { params:Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { id } = await params;
        const res = await serverFetch(`/study-session/${id}/attempt`, {
            method: "POST",
            body: JSON.stringify(body),
        });
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}
