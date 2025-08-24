
'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore/lite';
import { app } from '@/lib/firebase';
import { revalidatePath } from 'next/cache';
import ImageKit from 'imagekit';

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
    const db = getFirestore(app);
    const userRef = doc(db, 'users', currentUser.id);

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
        await updateDoc(userRef, dataToUpdate);
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

  // NOTE: This is a simplified password check. In a real application,
  // you would fetch the hashed password and use a library like bcrypt to compare.
  // For this demo, we'll assume the password is plaintext (which is NOT secure).
  const db = getFirestore(app);
  const userRef = doc(db, 'users', currentUser.id);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists() || userDoc.data().password !== validatedFields.data.currentPassword) {
      return { success: false, message: 'Incorrect current password.' };
  }

  try {
    await updateDoc(userRef, { password: validatedFields.data.newPassword });
    return { success: true, message: 'Password changed successfully.' };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, message: `Failed to change password: ${errorMessage}` };
  }
}
