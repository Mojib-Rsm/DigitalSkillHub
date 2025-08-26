
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { cookies } from "next/headers";

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    pages: {
        signIn: '/login',
        error: '/login', // Redirect to login page on error
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.id || !user.email) {
                console.error("User ID or email is missing from provider response.");
                return false; // Prevent sign-in if essential info is missing
            }

            if (account?.provider === 'google') {
                const db = getFirestore(app);
                const userRef = doc(db, 'users', user.id);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    // New user, create a document in Firestore
                    try {
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
                    } catch (e) {
                        console.error("Error creating new user in Firestore:", e);
                        return false;
                    }
                } else {
                    // Existing user, update image and name just in case it changed
                     try {
                        await updateDoc(userRef, {
                            name: user.name,
                            profile_image: user.image,
                            updated_at: serverTimestamp(),
                        });
                    } catch (e) {
                        console.error("Error updating existing user in Firestore:", e);
                        // Don't block sign-in for this, just log it.
                    }
                }

                // Set a session cookie
                 cookies().set('auth-session', user.id, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/',
                });

                return true;
            }
            return false;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
