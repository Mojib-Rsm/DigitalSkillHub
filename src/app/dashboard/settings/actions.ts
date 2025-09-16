
'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';
import ImageKit from 'imagekit';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});


// Schema for updating profile information
const ProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  phone: z.string().min(10, "Please enter a valid phone number.").optional().or(z.literal('')),
  photo: z.any().optional(),
});

// Schema for changing the password
const PasswordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z.string().min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match.",
    path: ["confirmPassword"],
});


type FormState = {
  success: boolean;
  message: string;
};

export async function updateUserProfileAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Permission denied. User not found.' };
  }

  const validatedFields = ProfileSchema.safeParse({
    name: formData.get('name'),
    phone: formData.get('phone'),
    photo: formData.get('photo'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map(e => e.message).join(', '),
    };
  }
  
  try {
    const dataToUpdate: Record<string, any> = {};
    
    if (validatedFields.data.name) {
        dataToUpdate.name = validatedFields.data.name;
    }
    if (validatedFields.data.phone) {
        dataToUpdate.phone = validatedFields.data.phone;
    }

    // Handle file upload to ImageKit
    const photo = validatedFields.data.photo as File;
    if (photo && photo.size > 0) {
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        const uploadResponse = await imagekit.upload({
            file: photoBuffer,
            fileName: `${currentUser.id}_${Date.now()}_${photo.name}`,
            folder: '/totthoai/profile_pictures',
        });
        dataToUpdate.profile_image = uploadResponse.url;
    }

    if (Object.keys(dataToUpdate).length > 0) {
        const setClause = Object.keys(dataToUpdate).map((key, i) => `"${key}" = $${i + 2}`).join(', ');
        const values = Object.values(dataToUpdate);
        await pool.query(`UPDATE users SET ${setClause} WHERE id = $1`, [currentUser.id, ...values]);
    }

    revalidatePath('/dashboard/settings');
    revalidatePath('/dashboard'); // Revalidate dashboard to update user info in sidebar potentially
    return { success: true, message: 'Profile updated successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to update profile: ${errorMessage}` };
  }
}

export async function changePasswordAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: 'Permission denied. User not found.' };
  }

  const validatedFields = PasswordSchema.safeParse({
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map(e => e.message).join(', '),
    };
  }

  try {
    const result = await pool.query('SELECT password FROM users WHERE id = $1', [currentUser.id]);
    
    if (result.rows.length === 0) {
        return { success: false, message: 'User not found.' };
    }
    const user = result.rows[0];

    const passwordMatch = await bcrypt.compare(validatedFields.data.currentPassword, user.password);
    if (!passwordMatch) {
      return { success: false, message: 'Incorrect current password.' };
    }

    const newHashedPassword = await bcrypt.hash(validatedFields.data.newPassword, 10);
    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, currentUser.id]);

    return { success: true, message: 'Password changed successfully.' };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to change password: ${errorMessage}` };
  }
}
