
'use server';

import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { getCurrentUser } from '@/services/user-service';

type Notification = {
  title: string;
  message: string;
  toolId?: string;
};

export async function sendNotification(notification: Notification) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied.' };
  }

  try {
    const db = getFirestore(app);
    await addDoc(collection(db, 'notifications'), {
      ...notification,
      sender: currentUser.name,
      createdAt: serverTimestamp(),
      readBy: [], // Array to track which users have read it
    });
    return { success: true, message: 'Notification sent successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error sending notification:", errorMessage);
    return { success: false, message: `Failed to send notification: ${errorMessage}` };
  }
}
