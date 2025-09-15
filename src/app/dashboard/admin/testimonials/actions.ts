
'use server';

import { z } from 'zod';
import { TestimonialModel } from '@/models/testimonialModel';
import { getCurrentUser } from '@/services/user-service';
import { revalidatePath } from 'next/cache';
import type { Testimonial } from '@/services/testimonial-service';

const testimonialSchema = z.object({
  feature: z.string().min(3, "Feature must be at least 3 characters."),
  quote: z.string().min(10, "Quote must be at least 10 characters."),
  metric: z.string().min(3, "Metric must be at least 3 characters."),
  authorName: z.string().min(3, "Author name is required."),
  authorRole: z.string().min(3, "Author role is required."),
  avatar: z.string().url("Must be a valid URL.").optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});


export async function saveTestimonialAction(
  testimonialId: string | null,
  data: z.infer<typeof testimonialSchema>
): Promise<{ success: boolean; message: string; testimonial?: Testimonial; }> {
  const currentUser = await getCurrentUser();
  if (currentUser?.role !== 'admin') {
    return { success: false, message: 'Permission denied.' };
  }

  const validatedData = testimonialSchema.safeParse(data);
  if (!validatedData.success) {
    console.error("Validation failed", validatedData.error.flatten());
    return { success: false, message: 'Invalid data provided.' };
  }

  try {
    if (testimonialId) {
      // Update
      await TestimonialModel.update(testimonialId, validatedData.data);
      revalidatePath('/dashboard/admin/testimonials');
      revalidatePath('/#success-stories'); // Assuming this is an ID on the homepage
      return { success: true, message: 'Testimonial updated.', testimonial: { id: testimonialId, ...validatedData.data } };
    } else {
      // Create
      const newId = await TestimonialModel.create(validatedData.data);
      revalidatePath('/dashboard/admin/testimonials');
      revalidatePath('/#success-stories');
      return { success: true, message: 'Testimonial created.', testimonial: { id: newId.toString(), ...validatedData.data } };
    }
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
}


export async function deleteTestimonialAction(testimonialId: string): Promise<{success: boolean; message: string}> {
    const currentUser = await getCurrentUser();
    if (currentUser?.role !== 'admin') {
        return { success: false, message: 'Permission denied.' };
    }

    try {
        await TestimonialModel.delete(testimonialId);
        revalidatePath('/dashboard/admin/testimonials');
        revalidatePath('/#success-stories');
        return { success: true, message: 'Testimonial deleted successfully.' };
    } catch (error) {
        return { success: false, message: (error as Error).message };
    }
}
