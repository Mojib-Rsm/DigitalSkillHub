
'use server';

import { z } from 'zod';
import { addPricingPlan, updatePricingPlan, type PricingPlan } from '@/services/pricing-service';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';

const pricingPlanSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0),
  discount: z.string().optional(),
  credits: z.coerce.number().min(1),
  validity: z.string().min(3),
  isPopular: z.boolean(),
  features: z.object({
      "Core Features": z.array(z.string()).min(1),
      "Advanced Features": z.array(z.string()).optional(),
      "Premium Features": z.array(z.string()).optional(),
  })
});

type FormState = {
  success: boolean;
  message: string;
  plan?: PricingPlan;
};

export async function savePricingPlanAction(
  planId: string | null,
  data: z.infer<typeof pricingPlanSchema>
): Promise<FormState> {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied.' };
  }

  const validatedData = pricingPlanSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Validation failed", validatedData.error.flatten());
    return { success: false, message: 'Invalid data provided.' };
  }

  let result;
  try {
    if (planId) {
      result = await updatePricingPlan(planId, validatedData.data);
      if (result.success) {
        revalidatePath('/dashboard/admin/pricing');
        revalidatePath('/#pricing');
        return { success: true, message: 'Pricing plan updated.', plan: { id: planId, ...validatedData.data } };
      }
    } else {
      result = await addPricingPlan(validatedData.data);
      if (result.success && result.id) {
        revalidatePath('/dashboard/admin/pricing');
        revalidatePath('/#pricing');
        const newPlan = { id: result.id, ...validatedData.data}; 
        return { success: true, message: 'Pricing plan created.', plan: newPlan };
      }
    }
    return { success: false, message: result.message || 'An unknown error occurred.' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}
