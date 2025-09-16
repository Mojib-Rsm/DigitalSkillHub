
'use server';

import { auth } from '@/auth';
import { UserModel } from '@/models/userModel';
import bcrypt from 'bcryptjs';
import type { User } from '@/models/userModel';
import pool from '@/lib/db';

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'user';
  credits: number;
  profile_image: string;
  status: 'active' | 'banned';
  plan_id: string;
  bookmarks?: string[];
};

export async function registerUser(userData: User) {
    const hashedPassword = await bcrypt.hash(userData.password!, 10);
    return await UserModel.create({ ...userData, password: hashedPassword });
}

export async function loginUser(email: string, password: string): Promise<User> {
    const user = await UserModel.findByEmail(email);
    if (!user || !user.password) {
        throw new Error('User not found or password not set.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    // Don't return password hash
    delete user.password;
    return user;
}


export async function getCurrentUser(): Promise<UserProfile | null> {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }
  
  try {
    const user = await UserModel.findByEmail(session.user.email);
    
    if (user && user.id) {
       const userProfile: UserProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role === 'admin' ? 'admin' : 'user',
            credits: user.credits || 100,
            profile_image: user.profile_image || session.user.image || '/default-avatar.png',
            status: user.status === 'active' || user.status === 'banned' ? user.status : 'active',
            plan_id: user.plan_id || 'free',
            bookmarks: user.bookmarks ? (user.bookmarks as any) : [],
       };
       return userProfile;
    } else {
        console.warn(`User with email ${session.user.email} not found in PostgreSQL database.`);
        return null;
    }

  } catch (error) {
    console.error(`Failed to get user profile from PostgreSQL:`, error);
    return null;
  }
}

export async function updateUserProfile(userId: number, data: Partial<UserProfile>) {
    const entries = Object.entries(data).filter(([_, v]) => v !== undefined);
    const setClause = entries.map(([key], i) => `"${key.toLowerCase()}" = $${i + 2}`).join(', ');
    const values = entries.map(([_, v]) => v);

    if (entries.length === 0) return { success: true };

    await pool.query(`UPDATE users SET ${setClause} WHERE id = $1`, [userId, ...values]);
    return { success: true };
}


export async function getAllUsers(): Promise<UserProfile[]> {
    const result = await pool.query('SELECT * FROM users');
    return (result.rows as UserProfile[]) || [];
}
