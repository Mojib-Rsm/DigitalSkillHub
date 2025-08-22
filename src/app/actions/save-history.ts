
'use server';

import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';

const HistoryItemSchema = z.object({
  tool: z.string(),
  input: z.any(),
  output: z.any(),
});

type HistoryItem = z.infer<typeof HistoryItemSchema>;


export async function saveHistoryAction(item: HistoryItem) {
  const user = await getCurrentUser();

  if (!user) {
    console.warn('Cannot save history: user is not logged in.');
    // Don't throw an error, just return, as this is not a critical failure for the user.
    return;
  }

  const validatedItem = HistoryItemSchema.safeParse(item);
  if (!validatedItem.success) {
    console.error('Invalid history item:', validatedItem.error);
    throw new Error('Invalid history item data');
  }

  try {
    const db = getFirestore(app);
    await addDoc(collection(db, 'history'), {
      uid: user.id,
      ...validatedItem.data,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Failed to save history to Firestore:', error);
    // Don't throw error to the client, just log it.
  }
}
