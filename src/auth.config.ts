
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  callbacks: {
    // We can define authorized callback here as it's used by the middleware
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPaths = ['/dashboard', '/checkout'];
      const isProtected = protectedPaths.some(path => nextUrl.pathname.startsWith(path));

      if (isProtected && !isLoggedIn) {
        const redirectUrl = new URL('/login', nextUrl.origin);
        redirectUrl.searchParams.append('redirect', nextUrl.pathname);
        return Response.redirect(redirectUrl);
      }
      
      return true;
    },
  },
} satisfies NextAuthConfig;
