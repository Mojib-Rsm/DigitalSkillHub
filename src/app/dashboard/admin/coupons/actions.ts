
'use server';

import { z } from 'zod';
import { addCoupon, updateCoupon, deleteCoupon, type Coupon } from '@/services/coupon-service';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters.").toUpperCase(),
  description: z.string().optional(),
  discountPercentage: z.coerce.number().min(1, "Discount must be at least 1%").max(100, "Discount cannot exceed 100%"),
  isActive: z.boolean(),
  validUntil: z.date().optional(),
  applicableTo: z.union([z.literal('all'), z.array(z.string())]),
});

type FormState = {
  success: boolean;
  message: string;
  coupon?: Coupon;
};

export async function saveCouponAction(
  couponId: string | null,
  data: z.infer<typeof couponSchema>
): Promise<FormState> {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied.' };
  }

  const validatedData = couponSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Validation failed", validatedData.error.flatten());
    return { success: false, message: 'Invalid data provided.' };
  }

  let result;
  try {
    if (couponId) {
      result = await updateCoupon(couponId, validatedData.data);
      if (result.success) {
        revalidatePath('/dashboard/admin/coupons');
        return { success: true, message: 'Coupon updated.', coupon: { id: couponId, ...validatedData.data } };
      }
    } else {
      result = await addCoupon(validatedData.data);
      if (result.success && result.id) {
        revalidatePath('/dashboard/admin/coupons');
        const newCoupon = { id: result.id, ...validatedData.data}; 
        return { success: true, message: 'Coupon created.', coupon: newCoupon };
      }
    }
    return { success: false, message: result.message || 'An unknown error occurred.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}


export async function deleteCouponAction(couponId: string): Promise<{success: boolean; message: string}> {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        return { success: false, message: 'Permission denied.' };
    }

    try {
        await deleteCoupon(couponId);
        revalidatePath('/dashboard/admin/coupons');
        return { success: true, message: 'Coupon deleted successfully.' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
