import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register"];

export function proxy(request: NextRequest) {
    const token = request.cookies.get("access_token")?.value;
    const path = request.nextUrl.pathname;

    const isPublic = PUBLIC_ROUTES.some((route) => path.startsWith(route));

    // sin token redirige automaticamente a login
    if (!token && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // con token redirige a dashboard
    if (token && isPublic) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};