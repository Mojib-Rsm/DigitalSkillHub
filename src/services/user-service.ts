

'use server';

import { auth } from '@/auth';
import { getFirestore, doc, getDoc, collection, getDocs, query, where, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore/lite';
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
  const db = getFirestore(app);
  const userRef = doc(db, 'users', userId);

  try {
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
      const userData = userSnapshot.data();
      return {
        id: userSnapshot.id,
        ...userData,
      } as UserProfile;
    } else {
      // User is authenticated but doesn't have a profile in Firestore yet.
      // This can happen for the very first login. Let's create it.
      console.log(`User profile for ${userId} not found, creating a new one.`);
      const newUserProfile: Omit<UserProfile, 'id'> = {
          name: session.user.name || 'New User',
          email: session.user.email,
          role: 'user', // Default role
          credits: 100, // Initial credits
          profile_image: session.user.image || '/default-avatar.png',
          status: 'active',
          plan_id: 'free',
          bookmarks: [],
      };

      await setDoc(userRef, {
        ...newUserProfile,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });

      return {
          id: userId,
          ...newUserProfile,
      } as UserProfile
    }

  } catch (error) {
    console.error(`Failed to get or create user profile (${userId}) from Firestore:`, error);
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
