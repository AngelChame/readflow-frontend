// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import {cookies} from "next/headers";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed = loginSchema.safeParse(body);
        if (!parsed.success) {
            const tree = z.treeifyError(parsed.error);
            const errors: Record<string, string[]> = {};
            for (const [key, value] of Object.entries(tree.properties ?? {})) {
                errors[key] = value.errors ?? [];
            }
            return NextResponse.json({ errors }, { status: 400 });
        }

        const externalRes = await fetch(
            `${process.env.EXTERNAL_API_URL}/auth/signin`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsed.data),
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

        const response = NextResponse.json({ user }, { status: 200 });

        response.cookies.set("access_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 3,
            path: "/",
        });

        return response;
    } catch {
        return NextResponse.json({ message: "Error interno" }, { status: 500 });
    }
}
