
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// The paths that require authentication
const protectedPaths = [
    '/dashboard',
    '/ai-tools/image-generator',
    '/ai-tools/video-generator',
    '/ai-tools/image-to-video-generator',
    '/ai-tools/passport-photo-maker',
    '/ai-tools/handwriting-extractor'
];


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        const sessionCookie = request.cookies.get('auth-session')?.value;

        if (!sessionCookie) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        try {
            // The session cookie is just the user ID. 
            // In a real production app, this should be a secure, signed JWT.
            const uid = sessionCookie;

            // Add the user's UID to the request headers for use in server components.
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-uid', uid);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            console.error('Middleware: Invalid session, redirecting to login.', error);
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(url);
            // Clear the invalid cookie
            response.cookies.delete('auth-session');
            return response;
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
