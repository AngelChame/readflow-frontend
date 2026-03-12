import { NextResponse } from "next/server";

export async function POST() {
    const response = NextResponse.json(
        { message: "Logout exitoso" },
        { status: 200 }
    );

    // Eliminar las cookies de autenticación
    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
}
