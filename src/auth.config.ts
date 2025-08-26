
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.warn("Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.");
}

export const authConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login', // Redirect to login page on error
  },
  callbacks: {
    // The `jwt` callback is called before the `session` callback.
    // It's used to encode the JWT. We can pass data to the session token here.
    async jwt({ token, user, account }) {
      if (account && user) {
        // This is the first sign-in.
        // The user object has the provider's user data.
        token.id = user.id;
      }
      return token;
    },
    // The `session` callback is called after the `jwt` callback.
    // It's used to create the session object that is returned to the client.
    async session({ session, token }) {
      if (session.user && token.id) {
        // Add the user ID from the token to the session object
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
