

'use server';

import { auth } from '@/auth';
import { UserModel } from '@/models/userModel';
import bcrypt from 'bcrypt';

export type UserProfile = {
  id: number; // Changed to number for MySQL INT
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

export async function registerUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return await UserModel.create({ ...userData, password: hashedPassword });
}

export async function loginUser(email: string, password: string): Promise<any> {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new Error("User not found");

    if (!user.password) throw new Error("Password not set for this user.");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    // Return a plain object without sensitive data
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}


export async function getCurrentUser(): Promise<UserProfile | null> {
  const session = await auth();

  if (!session?.user?.email) {
    return null;
  }
  
  try {
    const user = await UserModel.findByEmail(session.user.email);
    
    if (user && user.id) {
       // This is a partial mapping. We assume the MySQL user table has these columns.
       // In a real scenario, you'd ensure the DB schema matches this structure.
       const userProfile: UserProfile = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            role: user.role === 'admin' ? 'admin' : 'user', // Ensure role is correctly typed
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

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
    // This function needs to be rewritten to use UserModel and update MySQL.
    // For now, it's a placeholder.
    console.log(`Updating user ${userId} in MySQL with:`, data);
    return { success: true };
}


export async function getAllUsers(): Promise<UserProfile[]> {
    // This function needs to be implemented using UserModel.
    return [];
}
