
"use server";

import { passportPhotoMaker } from "@/ai/flows/passport-photo-maker";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const PassportPhotoMakerActionSchema = z.object({
  backgroundColor: z.enum(['White', 'Light Blue', 'Grey']),
  photo: z
    .any()
    .refine((file) => file?.size > 0, 'অনুগ্রহ করে একটি ছবি আপলোড করুন।')
    .refine((file) => file?.size <= MAX_FILE_SIZE, `ছবির আকার 4MB এর বেশি হতে পারবে না।`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সমর্থিত।"
    ),
});

type FormState = {
  message: string;
  imageUrl?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generatePassportPhoto(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PassportPhotoMakerActionSchema.safeParse({
    backgroundColor: formData.get("backgroundColor"),
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        backgroundColor: formData.get("backgroundColor") as string,
      }
    };
  }
  
  try {
    const { backgroundColor, photo } = validatedFields.data;
    
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;

    const result = await passportPhotoMaker({ backgroundColor, photoDataUri });

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
