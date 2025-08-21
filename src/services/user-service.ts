
'use server';

import { headers } from 'next/headers';
import { getFirestore, doc, getDoc, collection, getDocs } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  credits: number;
  profile_image: string;
  status: 'active' | 'banned';
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
    // The document ID in the 'users' collection is the user's email, not UID.
    // This needs to be consistent with how users are created/queried.
    // Let's assume for now the login/signup logic correctly uses a unique ID (like UID or email)
    // The seed data uses email as ID, so let's stick with that for now.
    // But a real app should use the Firebase Auth UID.
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);

    if (!userSnapshot.exists()) {
        console.warn(`No user found with ID: ${uid}`);
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
        status: userData.status,
    } as UserProfile;

  } catch (error) {
    console.error('Failed to get user profile from Firestore:', error);
    return null;
  }
}

export async function getAllUsers(): Promise<UserProfile[]> {
    const currentUser = await getCurrentUser();
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
             } as UserProfile;
        });
    } catch (error) {
        console.error('Failed to get all users from Firestore:', error);
        return [];
    }
}
