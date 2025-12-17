import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key-at-least-32-characters-long';
const key = new TextEncoder().encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
    const token = request.cookies.get("auth-token")?.value;
    let isValid = false;

    if (token) {
        try {
            await jwtVerify(token, key, { algorithms: ["HS256"] });
            isValid = true;
        } catch (err) {
            isValid = false;
        }
    }

    // Protected routes
    if (request.nextUrl.pathname.startsWith("/dashboard")) {
        if (!isValid) {
            return NextResponse.redirect(new URL("/login", request.url));
        }
    }

    // Auth routes (redirect to dashboard if already logged in)
    if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
        if (isValid) {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public (public files)
         * - api (API routes, though we might want to protect some)
         */
        "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
    ],
};
