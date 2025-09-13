
'use server';

import pool from '@/lib/mysql';
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
    await pool.query('INSERT INTO notifications SET ?', {
      ...notification,
      sender: currentUser.name,
    });
    return { success: true, message: 'Notification sent successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    console.error("Error sending notification:", errorMessage);
    return { success: false, message: `Failed to send notification: ${errorMessage}` };
  }
}
