
'use server';

import 'dotenv/config'; // Ensure env variables are loaded
import { admin } from '@/lib/firebase-admin';
import { headers } from 'next/headers';

export type HistoryItem = {
  id: string;
  tool: string;
  input: any;
  output: any;
  createdAt: string;
};

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccountJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountJson) {
      throw new Error('Firebase service account credentials are not set in environment variables.');
    }
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(serviceAccountJson)),
    });
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

export async function getHistory(): Promise<HistoryItem[]> {
  const headersList = headers();
  const uid = headersList.get('x-uid');
  
  if (!uid) {
    console.error("No UID found in headers");
    return [];
  }

  if (!admin.apps.length) {
    console.error('Firebase Admin SDK is not initialized.');
    return [];
  }

  try {
    const db = admin.firestore();
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
            createdAt: data.createdAt.toDate().toISOString(),
        } as HistoryItem;
    });

  } catch (error) {
    console.error('Failed to get history from Firestore:', error);
    return [];
  }
}
