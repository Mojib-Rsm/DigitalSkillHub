
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.");
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
    async signIn({ user, account }) {
      if (account?.provider !== 'google') {
          return false;
      }

      if (!user.id || !user.email) {
          console.error("User ID or email is missing from provider response.");
          return false; // Mandatory fields
      }

      try {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', user.id);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: user.name,
            email: user.email,
            profile_image: user.image,
            role: 'user',
            credits: 100,
            plan_id: 'free',
            is_verified: true,
            status: 'active',
            bookmarks: [],
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
          });
        } else {
          await updateDoc(userRef, {
            name: user.name,
            profile_image: user.image,
            updated_at: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error("Firestore error during sign-in:", error);
        // Do not block sign-in for db errors, log it instead.
        // The user can still be authenticated, and their profile can be synced later.
      }
      
      return true; // Allow sign-in
    },
    async jwt({ token, user, account, profile }) {
      if (user) { // This block is only executed on sign-in
        token.id = user.id;
        try {
          const db = getFirestore(app);
          const userRef = doc(db, 'users', user.id);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            const data = userSnap.data();
            token.role = data.role;
            token.credits = data.credits;
            token.planId = data.plan_id;
          } else {
            token.role = 'user';
            token.credits = 100;
            token.planId = 'free';
          }
        } catch (error) {
          console.error("Firestore error in JWT callback:", error);
          token.role = 'user';
          token.credits = 100;
          token.planId = 'free';
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
        (session.user as any).credits = token.credits;
        (session.user as any).planId = token.planId;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
