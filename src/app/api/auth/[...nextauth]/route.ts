
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp, updateDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

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
                    return true;
                } catch (e) {
                    console.error("Error interacting with Firestore during sign-in:", e);
                    // This will prevent the user from signing in if Firestore is down or there's a rules issue.
                    return false;
                }
            }
            return false;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
