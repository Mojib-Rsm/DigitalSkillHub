
'use server';

import { z } from 'zod';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';
import { updatePaymentMethods } from '@/services/settings-service';

const PaymentSettingsSchema = z.object({
  bkash_number: z.string().min(11, "bKash number must be valid.").max(11, "bKash number must be valid."),
  nagad_number: z.string().min(11, "Nagad number must be valid.").max(11, "Nagad number must be valid."),
});

export async function updatePaymentSettingsAction(prevState: any, formData: FormData) {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied.' };
  }

  const validatedFields = PaymentSettingsSchema.safeParse({
    bkash_number: formData.get('bkash_number'),
    nagad_number: formData.get('nagad_number'),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      message: validatedFields.error.errors.map(e => e.message).join(', '),
    };
  }

  try {
    const { bkash_number, nagad_number } = validatedFields.data;
    await updatePaymentMethods(bkash_number, nagad_number);
    
    revalidatePath('/checkout'); // Revalidate any checkout pages
    
    return { success: true, message: 'Payment settings updated successfully.' };
  } catch (error) {
    console.error('Error updating payment settings:', error);
    return { success: false, message: 'An unexpected error occurred.' };
  }
}
