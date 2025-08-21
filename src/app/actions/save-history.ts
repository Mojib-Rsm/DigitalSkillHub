
'use server';

import { admin } from '@/lib/firebase-admin';
import { z } from 'zod';
import { headers } from 'next/headers';

const HistoryItemSchema = z.object({
  tool: z.string(),
  input: z.any(),
  output: z.any(),
});

type HistoryItem = z.infer<typeof HistoryItemSchema>;

export async function saveHistoryAction(item: HistoryItem) {
  const headersList = headers();
  const uid = headersList.get('x-uid'); // Use the UID from the request header set by middleware

  if (!uid) {
    console.warn('Cannot save history: user is not logged in.');
    return; // Don't throw an error, just skip saving
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
    // Don't re-throw, as failing to save history shouldn't break the user's main action
  }
}
