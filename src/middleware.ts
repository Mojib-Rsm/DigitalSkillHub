import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
const { auth } = NextAuth(authConfig);

// The paths that require authentication
const protectedPaths = [
    '/dashboard',
];
 
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected && !req.auth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return Response.redirect(url);
  }
});
 
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
