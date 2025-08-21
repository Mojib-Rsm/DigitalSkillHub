
'use server';

import { z } from 'zod';
import { sendNotification } from '@/services/notification-service';
import { revalidatePath } from 'next/cache';

const NotificationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long."),
  message: z.string().min(20, "Message must be at least 20 characters long."),
});

type FormState = {
  success: boolean;
  message: string;
};

export async function sendNotificationAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = NotificationSchema.safeParse({
    title: formData.get('title'),
    message: formData.get('message'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map((e) => e.message).join(', '),
    };
  }

  const result = await sendNotification(validatedFields.data);

  if (result.success) {
    // Optionally revalidate paths where notifications might be displayed
    revalidatePath('/dashboard');
  }

  return result;
}
