
'use server';

import { headers } from 'next/headers';
import { getFirestore, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { getCurrentUser } from './user-service';

export type HistoryItem = {
  id: string;
  tool: string;
  input: any;
  output: any;
  createdAt: string;
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
    const q = query(
        historyCol, 
        where('uid', '==', user.id),
        orderBy('createdAt', 'desc'),
        limit(50)
    );

    const historySnapshot = await getDocs(q);

    if (historySnapshot.empty) {
      return [];
    }
    
    return historySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            tool: data.tool,
            input: data.input,
            output: data.output,
            // Firestore Timestamps need to be converted
            createdAt: data.createdAt.toDate().toISOString(),
        } as HistoryItem;
    });

  } catch (error) {
    console.error('Failed to get history from Firestore:', error);
    // In a production app, you might want to handle this error more gracefully
    return [];
  }
}
