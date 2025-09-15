

'use server';

import { auth } from '@/auth';
import { UserModel } from '@/models/userModel';
import bcryptjs from 'bcryptjs';
import type { User } from '@/models/userModel';
import pool from '@/lib/mysql';

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
    const hashedPassword = await bcryptjs.hash(userData.password!, 10);
    return await UserModel.create({ ...userData, password: hashedPassword });
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
            bookmarks: user.bookmarks ? JSON.parse(user.bookmarks) : [],
       };
       return userProfile;
    } else {
        console.warn(`User with email ${session.user.email} not found in MySQL database.`);
        return null;
    }

  } catch (error) {
    console.error(`Failed to get user profile from MySQL:`, error);
    return null;
  }
}

export async function updateUserProfile(userId: number, data: Partial<UserProfile>) {
    const [result] = await pool.query('UPDATE users SET ? WHERE id = ?', [data, userId]);
    return { success: true };
}


export async function getAllUsers(): Promise<UserProfile[]> {
    const [rows] = await pool.query('SELECT * FROM users');
    return rows as UserProfile[];
}
