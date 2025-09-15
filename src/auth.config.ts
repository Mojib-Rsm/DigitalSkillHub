
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { UserModel, type User } from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import { z } from 'zod';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Moved loginUser function here to break circular dependency
async function loginUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    try {
        const user = await UserModel.findByEmail(email);
        if (!user || !user.password) {
            return null;
        }

        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;

    } catch (error) {
        console.error("Error in loginUser:", error);
        return null;
    }
}


export const authConfig = {
  providers: [
    Google({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ email: z.string().email(), password: z.string().min(6) })
                .safeParse(credentials);
            
            if (parsedCredentials.success) {
                const { email, password } = parsedCredentials.data;
                const user = await loginUser(email, password);
                if (!user) return null;

                // Return a plain object that can be serialized for the session
                return { id: user.id!.toString(), name: user.name, email: user.email, image: user.profile_image };
            }
            return null;
        }
    })
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
                        profile_image: user.image,
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
