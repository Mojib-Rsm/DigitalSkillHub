
'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';
import pool from '@/lib/db';

const UpdateRoleSchema = z.object({
  userId: z.string(),
  role: z.enum(['user', 'admin']),
});

export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const currentUser = await getCurrentUser();

  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied. You must be an admin to change roles.' };
  }
  
  if (currentUser?.id === parseInt(userId)) {
    return { success: false, message: 'Admins cannot change their own role.' };
  }

  const validatedData = UpdateRoleSchema.safeParse({ userId, role });

  if (!validatedData.success) {
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    await pool.query('UPDATE users SET role = $1 WHERE id = $2', [role, userId]);
    
    revalidatePath('/dashboard/admin/users');

    return { success: true, message: `Successfully updated role for user ${userId} to ${role}.` };
  } catch (error) {
    console.error('Error updating user role:', error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return { success: false, message: `Failed to update role. Please check your permissions and PostgreSQL setup.` };
  }
}
