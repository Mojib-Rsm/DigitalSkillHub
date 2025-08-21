
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { admin } from './lib/firebase-admin';

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
        const token = request.cookies.get('firebaseIdToken')?.value;

        if (!token) {
            console.log('Middleware: No token found, redirecting to login.');
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            url.searchParams.set('redirect', pathname);
            return NextResponse.redirect(url);
        }

        try {
            if (!admin.apps.length) {
                console.error("Firebase Admin SDK not initialized in middleware.");
                // Potentially redirect to an error page or allow access with a warning
                return NextResponse.next();
            }
            const decodedToken = await admin.auth().verifyIdToken(token);
            const uid = decodedToken.uid;

            // Add the user's UID to the request headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('uid', uid);

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
