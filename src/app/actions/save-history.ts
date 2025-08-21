
'use server';

import { admin } from '@/lib/firebase-admin';
import { z } from 'zod';

const HistoryItemSchema = z.object({
  uid: z.string(),
  tool: z.string(),
  input: z.any(),
  output: z.any(),
});

type HistoryItem = z.infer<typeof HistoryItemSchema>;

export async function saveHistoryAction(item: HistoryItem) {
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
      ...validatedItem.data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to save history to Firestore:', error);
    // Re-throw the error to be handled by the caller
    throw error;
  }
}
