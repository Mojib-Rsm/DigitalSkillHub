'use server';

import { headers } from 'next/headers';
import { getFirestore, doc, getDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  credits: number;
  profile_image: string;
};

export async function getCurrentUser(): Promise<UserProfile | null> {
  const headersList = headers();
  const uid = headersList.get('x-uid');
  
  if (!uid) {
    console.warn("Cannot get user profile: user is not logged in.");
    return null;
  }

  try {
    const db = getFirestore(app);
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        console.warn(`No user found with UID: ${uid}`);
        return null;
    }
    
    const userData = userSnapshot.data();
    
    return {
        id: userSnapshot.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        credits: userData.credits,
        profile_image: userData.profile_image,
    } as UserProfile;

  } catch (error) {
    console.error('Failed to get user profile from Firestore:', error);
    return null;
  }
}
