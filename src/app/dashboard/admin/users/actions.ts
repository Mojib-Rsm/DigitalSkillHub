
'use server';

import { z } from 'zod';
import { getFirestore, doc, updateDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';

const UpdateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['user', 'admin']),
});

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied. You must be an admin to change roles.' };
  }
  
  if (currentUser?.id === userId) {
    return { success: false, message: 'Admins cannot change their own role.' };
  }

  const validatedData = UpdateRoleSchema.safeParse({ userId, role });

  if (!validatedData.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    const db = getFirestore(app);
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role: role,
    });
    
    // Revalidate the users page to show the updated role
    revalidatePath('/dashboard/admin/users');

    return { success: true, message: `Successfully updated role for user ${userId} to ${role}.` };
  } catch (error) {
    console.error('Error updating user role:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message: `Failed to update role: ${errorMessage}` };
  }
}
