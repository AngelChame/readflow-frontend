import { NextRequest, NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server.fetch";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = await params;
        const res = await serverFetch(`/study-session/${id}/quiz`);
        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}
