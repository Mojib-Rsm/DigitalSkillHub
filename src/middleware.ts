
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
const { auth } = NextAuth(authConfig);

// Paths that require authentication
const protectedPaths = [
    '/dashboard',
];

// Paths that should only be accessible to unauthenticated users
const publicOnlyPaths = [
    '/login',
    '/signup',
];
 
export default auth((req) => {
  const { pathname } = req.nextUrl;
  
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  const isPublicOnly = publicOnlyPaths.some(path => pathname.startsWith(path));
  const isLoggedIn = !!req.auth;

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
