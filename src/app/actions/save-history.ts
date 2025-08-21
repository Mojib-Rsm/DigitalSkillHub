
'use server';

import 'dotenv/config'; // Ensure env variables are loaded
import { admin } from '@/lib/firebase-admin';
import { z } from 'zod';
import { headers } from 'next/headers';

const HistoryItemSchema = z.object({
  tool: z.string(),
  input: z.any(),
  output: z.any(),
});

type HistoryItem = z.infer<typeof HistoryItemSchema>;

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
      console.error("Firebase admin initialization error in saveHistoryAction:", error);
    }
}


export async function saveHistoryAction(item: HistoryItem) {
  const headersList = headers();
  const uid = headersList.get('x-uid');

  if (!uid) {
    console.warn('Cannot save history: user is not logged in.');
    return;
  }

  const validatedItem = HistoryItemSchema.safeParse(item);
  if (!validatedItem.success) {
    throw new Error('Invalid history item');
  }

  if (!admin.apps.length) {
    console.error('Firebase Admin SDK is not initialized.');
    throw new Error('Server configuration error');
  }

  const db = admin.firestore();
  try {
    await db.collection('history').add({
      uid: uid,
      ...validatedItem.data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to save history to Firestore:', error);
  }
}
