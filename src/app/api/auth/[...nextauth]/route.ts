
import NextAuth, { NextAuthOptions, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import type { UserProfile } from "@/services/user-service";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing Google OAuth credentials. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file.");
}

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login', // Redirect to login page on error
    },
    callbacks: {
        async jwt({ token, user, account }) {
            if (account && user) {
                // This is the first sign-in
                token.id = user.id;
                token.accessToken = account.access_token;
                
                const db = getFirestore(app);
                const userRef = doc(db, 'users', user.id);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    token.role = userSnap.data().role;
                    token.credits = userSnap.data().credits;
                    token.planId = userSnap.data().plan_id;
                } else {
                    token.role = 'user'; // Default role for new user
                    token.credits = 100;
                    token.planId = 'free';
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
                (session.user as any).role = token.role;
                (session.user as any).credits = token.credits;
                (session.user as any).planId = token.planId;
            }
            return session;
        }
    },
    events: {
        async signIn({ user, account, isNewUser }) {
             if (!user.id || !user.email) {
                console.error("User ID or email is missing from provider response.");
                return;
            }
            
            const db = getFirestore(app);
            const userRef = doc(db, 'users', user.id);

             try {
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    // New user, create a document in Firestore
                    await setDoc(userRef, {
                        name: user.name,
                        email: user.email,
                        profile_image: user.image,
                        role: 'user',
                        credits: 100, // Initial credits
                        plan_id: 'free',
                        is_verified: true,
                        status: 'active',
                        bookmarks: [],
                        created_at: serverTimestamp(),
                        updated_at: serverTimestamp(),
                    });
                } else {
                    // Existing user, update image and name just in case it changed
                    await updateDoc(userRef, {
                        name: user.name,
                        profile_image: user.image,
                        updated_at: serverTimestamp(),
                    });
                }
            } catch (e) {
                console.error("Error interacting with Firestore during sign-in event:", e);
                // Prevent sign-in if database operation fails
                throw new Error("Could not save user data to database.");
            }
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
