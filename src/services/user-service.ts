

'use server';

import { auth } from '@/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

export type UserProfile = {
  id: string;
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

export async function getCurrentUser(): Promise<UserProfile | null> {
  const session = await auth();

  if (!session?.user?.email || !session?.user?.id) {
    return null;
  }
  
  const userId = session.user.id;

  try {
    const db = getFirestore(app);
    const userRef = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        console.warn(`No user found in Firestore with ID: ${userId}, but session exists.`);
        return null;
    }
    
    const userData = userSnapshot.data();
    
    if (!userData) {
      return null;
    }
    
    return {
        id: userSnapshot.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        credits: userData.credits,
        profile_image: userData.profile_image,
        status: userData.status,
        plan_id: userData.plan_id,
        bookmarks: userData.bookmarks || [],
    } as UserProfile;

  } catch (error) {
    console.error('Failed to get user profile from Firestore:', error);
    return null;
  }
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
    try {
        const db = getFirestore(app);
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, data);
        return { success: true };
    } catch(error) {
        console.error(`Failed to update user profile for ${userId}`, error);
        return { success: false, message: (error as Error).message };
    }
}


export async function getAllUsers(): Promise<UserProfile[]> {
    const currentUser = await getCurrentUser();
    // Security Rule should enforce this, but double-checking here.
    if (currentUser?.role !== 'admin') {
        console.error("Permission denied: Only admins can fetch all users.");
        return [];
    }

    try {
        const db = getFirestore(app);
        const usersCol = collection(db, 'users');
        const userSnapshot = await getDocs(usersCol);
        
        if (userSnapshot.empty) {
            return [];
        }

        return userSnapshot.docs.map(doc => {
             const data = doc.data();
             return {
                id: doc.id,
                name: data.name,
                email: data.email,
                phone: data.phone,
                role: data.role,
                credits: data.credits,
                profile_image: data.profile_image,
                status: data.status,
                plan_id: data.plan_id,
                bookmarks: data.bookmarks || [],
             } as UserProfile;
        });
    } catch (error) {
        console.error('Failed to get all users from Firestore:', error);
        return [];
    }
}
