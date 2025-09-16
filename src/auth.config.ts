
import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ['/dashboard', '/checkout', '/ai-tools'];
      const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path));

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/login', nextUrl.origin);
        redirectUrl.searchParams.append('redirect', nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }
      
      const publicOnlyPaths = ['/login', '/signup', '/forgot-password'];
      const isPublicOnly = publicOnlyPaths.some(path => nextUrl.pathname.startsWith(path));

      if (isLoggedIn && isPublicOnly) {
        const url = nextUrl.clone();
        url.pathname = '/dashboard';
        return Response.redirect(url);
      }
      
      return true;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
