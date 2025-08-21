
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
  const token = headersList.get('x-id-token');
  const uidFromHeader = headersList.get('x-uid');
  
  if (!token || !uidFromHeader) {
    // This should not happen if middleware is set up correctly, but as a safeguard:
    console.error("No token or UID found in headers");
    return [];
  }

  if (!admin.apps.length) {
    console.error('Firebase Admin SDK is not initialized.');
    return [];
  }

  try {
    // Verify the token on the server-side to ensure it's valid
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Security check: ensure the UID from the token matches the one from the header
    if (decodedToken.uid !== uidFromHeader) {
        console.error("UID mismatch between token and header.");
        return [];
    }
    
    const db = admin.firestore();
    const historySnapshot = await db
      .collection('history')
      .where('uid', '==', decodedToken.uid)
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
    // This will catch token verification errors as well
    return [];
  }
}
