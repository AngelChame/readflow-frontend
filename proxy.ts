import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    // Variable de prueba
    const isAuthenticated = false;

    const isAuthRoute = request.nextUrl.pathname.startsWith('/login') ||
        request.nextUrl.pathname.startsWith('/register');

    // Si está autenticado e intenta ir a login/register → redirige a /
    if (isAuthRoute && isAuthenticated) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // Si NO está autenticado e intenta ir a rutas protegidas → redirige a /login
    if (!isAuthRoute && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Con autenticación → permite acceso
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next|.*\\..*).*)']
};
