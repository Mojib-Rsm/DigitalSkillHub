
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

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
        if (account?.provider === 'google') {
            const db = getFirestore(app);
            const userRef = doc(db, 'users', user.id);
            try {
                const userDoc = await getDoc(userRef);
                if (!userDoc.exists()) {
                    // New user, create a profile
                    await setDoc(userRef, {
                        name: user.name,
                        email: user.email,
                        profile_image: user.image,
                        role: 'user',
                        credits: 100, // Initial credits
                        plan_id: 'free',
                        status: 'active',
                        bookmarks: [],
                        created_at: serverTimestamp(),
                        updated_at: serverTimestamp(),
                    });
                }
                return true; // Allow sign in
            } catch (error) {
                console.error("Error during signIn callback in auth.config.ts:", error);
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
