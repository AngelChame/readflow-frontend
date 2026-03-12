import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("access_token")?.value;

        const formData = await req.formData();


        const res = await fetch(`${process.env.EXTERNAL_API_URL}/study-session`, {
            method: "POST",
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            return NextResponse.json({ message: data.message }, { status: res.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}
