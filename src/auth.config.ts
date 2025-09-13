
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { UserModel } from '@/models/userModel';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
     async signIn({ user, account, profile }) {
        if (account?.provider === 'google' && user.email) {
            try {
                const existingUser = await UserModel.findByEmail(user.email);
                
                if (!existingUser) {
                    // New user, create a profile in MySQL
                    await UserModel.create({
                        name: user.name || 'New User',
                        email: user.email,
                        // MySQL user id will be auto-incremented
                    });
                }
                return true; // Allow sign in
            } catch (error) {
                console.error("Error during MySQL user check/creation in signIn callback:", error);
                return false; // Prevent sign in on database error
            }
        }
        return true; // Allow other providers or scenarios
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
