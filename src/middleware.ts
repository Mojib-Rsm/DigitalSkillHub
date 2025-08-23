
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The paths that require authentication
const protectedPaths = [
    '/dashboard',
];


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        const sessionCookie = request.cookies.get('auth-session');

        if (!sessionCookie) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
