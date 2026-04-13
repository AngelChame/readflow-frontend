import { NextRequest, NextResponse } from "next/server";
import { adminFetch } from "@/lib/api/admin.fetch";

export async function GET(req: NextRequest) {
  try {
    const email = req.nextUrl.searchParams.get("email");
    if (!email)
      return NextResponse.json({ message: "email requerido" }, { status: 400 });

    const res = await adminFetch(`/user?email=${encodeURIComponent(email)}`);
    const data = await res.json();
    if (!res.ok)
      return NextResponse.json(
        { message: data.message },
        { status: res.status },
      );
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Error interno" }, { status: 500 });
  }
}
