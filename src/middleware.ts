
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// The paths that require authentication
const protectedPaths = [
    '/dashboard',
    '/ai-tools/image-generator',
    '/ai-tools/video-generator',
    '/ai-tools/image-to-video-generator',
    '/ai-tools/passport-photo-maker',
    '/ai-tools/handwriting-extractor'
];

interface DecodedToken {
    uid: string;
    [key: string]: any;
}


export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isProtected = protectedPaths.some(path => pathname.startsWith(path));

    if (isProtected) {
        const token = request.cookies.get('firebaseIdToken')?.value;

        if (!token) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        try {
            // Decode the token to get the UID without verification in the edge.
            // The actual verification will happen in server components/actions.
            const decodedToken = jwtDecode<DecodedToken>(token);
            const uid = decodedToken.uid;

            // Add the user's UID to the request headers for use in server components.
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-uid', uid);
            requestHeaders.set('x-id-token', token);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });

        } catch (error) {
            console.error('Middleware: Invalid token, redirecting to login.', error);
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            const response = NextResponse.redirect(url);
            // Clear the invalid cookie
            response.cookies.delete('firebaseIdToken');
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
