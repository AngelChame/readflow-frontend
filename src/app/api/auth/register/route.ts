import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/schemas/auth.schema";
import { z } from "zod";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            const tree = z.treeifyError(parsed.error);

            const errors: Record<string, string[]> = {};
            for (const [key, value] of Object.entries(tree.properties ?? {})) {
                errors[key] = value.errors ?? [];
            }

            return NextResponse.json({ errors }, { status: 400 });
        }


        const payload = parsed.data;
        const externalRes = await fetch(
            `${process.env.EXTERNAL_API_URL}/auth/signup`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            }
        );

        const data = await externalRes.json();

        if (!externalRes.ok) {
            return NextResponse.json(
                { message: data.message },
                { status: externalRes.status }
            );
        }

        const { accessToken, user } = data;

        const response = NextResponse.json({ user }, { status: 201 });

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