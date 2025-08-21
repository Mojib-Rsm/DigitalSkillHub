

'use server';

import { cookies } from 'next/headers';
import { getFirestore as getAdminFirestore, doc as adminDoc, getDoc as adminGetDoc, collection as adminCollection, getDocs as adminGetDocs } from 'firebase-admin/firestore';
import { adminApp } from '@/lib/firebase-admin';

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
    const adminDb = getAdminFirestore(adminApp);
    const userRef = adminDoc(adminDb, 'users', uid);
    const userSnapshot = await adminGetDoc(userRef);

    if (!userSnapshot.exists) {
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
    if (currentUser?.role !== 'admin') {
        console.error("Permission denied: Only admins can fetch all users.");
        return [];
    }

    try {
        const adminDb = getAdminFirestore(adminApp);
        const usersCol = adminCollection(adminDb, 'users');
        const userSnapshot = await adminGetDocs(usersCol);
        
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
