
'use server';

import { cookies } from 'next/headers';
import { getFirestore, doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { User, getAuth } from 'firebase/auth';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  credits: number;
  profile_image: string;
  status: 'active' | 'banned';
  plan_id: string;
};

export async function getCurrentUser(): Promise<UserProfile | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('auth-session');
  
  if (!sessionCookie) {
    return null;
  }
  
  const uid = sessionCookie.value;

  try {
    const db = getFirestore(app);
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        console.warn(`No user found with ID: ${uid}`);
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
        role: userData.role,
        credits: userData.credits,
        profile_image: userData.profile_image,
        status: userData.status,
        plan_id: userData.plan_id,
    } as UserProfile;

  } catch (error) {
    console.error('Failed to get user profile from Firestore:', error);
    return null;
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
                role: data.role,
                credits: data.credits,
                profile_image: data.profile_image,
                status: data.status,
                plan_id: data.plan_id
             } as UserProfile;
        });
    } catch (error) {
        console.error('Failed to get all users from Firestore:', error);
        return [];
    }
}
