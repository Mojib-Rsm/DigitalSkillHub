
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextRequest, NextResponse } from 'next/server';
import pool from './lib/mysql';
 
const { auth } = NextAuth(authConfig);

// Paths that require authentication
const protectedPaths = [
    '/dashboard',
    '/checkout',
];

// Paths that should only be accessible to unauthenticated users
const publicOnlyPaths = [
    '/login',
    '/signup',
];

async function isAppInstalled() {
    try {
        const [rows] = await pool.query<any[]>("SELECT * FROM settings WHERE setting_key = 'language'");
        return rows.length > 0;
    } catch (error) {
        // This likely means the 'settings' table doesn't exist yet.
        return false;
    }
}
 
export default auth(async (req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const installed = await isAppInstalled();

  // If app is not installed, redirect all requests to /install, except for /install itself and its assets
  if (!installed && !pathname.startsWith('/install')) {
      return NextResponse.redirect(new URL('/install', req.url));
  }
  
  // If app is installed, but user tries to access /install, redirect to dashboard or homepage
  if (installed && pathname.startsWith('/install')) {
       return NextResponse.redirect(new URL(isLoggedIn ? '/dashboard' : '/', req.url));
  }

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicOnly = publicOnlyPaths.some(path => pathname.startsWith(path));

  // If user is logged in and trying to access a public-only page (like login/signup)
  if (isLoggedIn && isPublicOnly) {
    const url = req.nextUrl.clone();
    url.pathname = '/dashboard';
    return Response.redirect(url);
  }

  // If user is not logged in and trying to access a protected page
  if (!isLoggedIn && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return Response.redirect(url);
  }

  // Allow the request to proceed if no rules match
  return;
});
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
