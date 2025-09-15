
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { UserModel } from '@/models/userModel';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { loginUser } from './services/user-service';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

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
                try {
                    const user = await loginUser(email, password);
                    if (user) {
                        return { id: user.id.toString(), name: user.name, email: user.email, image: user.profile_image };
                    }
                } catch (error) {
                    console.error("Login error:", error);
                    return null;
                }
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
