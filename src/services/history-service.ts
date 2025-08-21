
'use server';

import { admin } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export type HistoryItem = {
  id: string;
  tool: string;
  input: any;
  output: any;
  createdAt: string;
};

export async function getHistory(): Promise<HistoryItem[]> {
  const headersList = headers();
  const uid = headersList.get('uid');

  if (!uid) {
    // Return empty array or throw an error if user is not authenticated
    return [];
  }

  if (!admin.apps.length) {
    console.error('Firebase Admin SDK is not initialized.');
    return [];
  }

  const db = admin.firestore();
  try {
    const historySnapshot = await db
      .collection('history')
      .where('uid', '==', uid)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

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
            // Convert Firestore Timestamp to ISO string
            createdAt: data.createdAt.toDate().toISOString(),
        } as HistoryItem;
    });

  } catch (error) {
    console.error('Failed to get history from Firestore:', error);
    return [];
  }
}
