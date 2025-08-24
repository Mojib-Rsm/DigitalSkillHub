
'use server';

import { headers } from 'next/headers';
import { getFirestore, collection, query, where, getDocs, orderBy, limit, doc, getDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { getCurrentUser } from './user-service';

export type HistoryItem = {
  id: string;
  tool: string;
  input: any;
  output: any;
  createdAt: string;
  uid?: string; // Add uid to be able to fetch user info for admin view
  userName?: string;
  userImage?: string;
};


export async function getHistory(): Promise<HistoryItem[]> {
  const user = await getCurrentUser();
  
  if (!user) {
    console.warn("Cannot get history: user is not logged in.");
    return [];
  }

  try {
    const db = getFirestore(app);
    const historyCol = collection(db, 'history');
    
    // If user is admin, fetch all history. Otherwise, just for the current user.
    const historyQuery = user.role === 'admin' 
        ? query(historyCol, orderBy('createdAt', 'desc'), limit(100))
        : query(historyCol, where('uid', '==', user.id), orderBy('createdAt', 'desc'), limit(50));

    const historySnapshot = await getDocs(historyQuery);

    if (historySnapshot.empty) {
      return [];
    }
    
    const historyItems = await Promise.all(historySnapshot.docs.map(async (docSnap) => {
        const data = docSnap.data();
        const item: HistoryItem = {
            id: docSnap.id,
            tool: data.tool,
            input: data.input,
            output: data.output,
            createdAt: data.createdAt.toDate().toISOString(),
        };

        // If admin, fetch user details for each history item
        if (user.role === 'admin' && data.uid) {
            item.uid = data.uid;
            try {
                const userDoc = await getDoc(doc(db, 'users', data.uid));
                if (userDoc.exists()) {
                    item.userName = userDoc.data().name;
                    item.userImage = userDoc.data().profile_image;
                } else {
                    item.userName = "Unknown User";
                    item.userImage = "";
                }
            } catch (e) {
                 item.userName = "Error fetching user";
                 item.userImage = "";
            }
        }
        return item;
    }));
    
    return historyItems;

  } catch (error) {
    console.error('Failed to get history from Firestore:', error);
    // In a production app, you might want to handle this error more gracefully
    return [];
  }
}
