
"use server";

import { passportPhotoMaker } from "@/ai/flows/passport-photo-maker";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const PassportPhotoMakerActionSchema = z.object({
  backgroundColor: z.enum(['White', 'Light Blue', 'Grey']),
  photo: z
    .any()
    .refine((file) => file?.size > 0, 'অনুগ্রহ করে প্রথম ছবিটি আপলোড করুন।'),
  photo2: z.any().optional(),
  couplePhoto: z.boolean(),
});

type FormState = {
  message: string;
  imageUrl?: string;
  fields?: Record<string, string | boolean>;
  issues?: string[];
};

export async function generatePassportPhoto(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const couplePhoto = formData.get("couplePhoto") === "true";

  const validatedFields = PassportPhotoMakerActionSchema.safeParse({
    backgroundColor: formData.get("backgroundColor"),
    photo: formData.get("photo"),
    photo2: formData.get("photo2"),
    couplePhoto: couplePhoto,
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        backgroundColor: formData.get("backgroundColor") as string,
        couplePhoto: couplePhoto,
      }
    };
  }
  
  try {
    const { backgroundColor, photo, photo2 } = validatedFields.data;
    
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;
    
    let photoDataUri2;
    if (couplePhoto && photo2 && photo2.size > 0) {
        const photoBuffer2 = Buffer.from(await photo2.arrayBuffer());
        photoDataUri2 = `data:${photo2.type};base64,${photoBuffer2.toString('base64')}`;
    } else if (couplePhoto && (!photo2 || photo2.size === 0)) {
        return { message: "যুগল ছবির জন্য অনুগ্রহ করে দ্বিতীয় ছবিটিও আপলোড করুন।" };
    }

    const result = await passportPhotoMaker({ 
        backgroundColor, 
        photoDataUri, 
        photoDataUri2,
        couplePhoto
    });

    if (result.imageUrl) {
      return {
        message: "success",
        imageUrl: result.imageUrl,
      };
    } else {
        return { message: "Failed to generate photo. Please try again." }
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
        // Provide a more specific error message to the user.
        return { message: `ছবি তৈরি করতে একটি ত্রুটি ঘটেছে: ${error.message}` };
    }
    return {
      message: "ছবি তৈরি করতে একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে কয়েক মিনিট পর আবার চেষ্টা করুন।",
    };
  }
}
