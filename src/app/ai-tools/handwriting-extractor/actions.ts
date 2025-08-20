
"use server";

import { handwritingExtractor, HandwritingExtractorOutput } from "@/ai/flows/handwriting-extractor";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const HandwritingExtractorActionSchema = z.object({
  photos: z
    .array(z.any())
    .min(1, 'অনুগ্রহ করে কমপক্ষে একটি ছবি আপলোড করুন।')
    .refine((files) => files.every(file => file.size <= MAX_FILE_SIZE), `প্রতিটি ছবির আকার 5MB এর বেশি হতে পারবে না।`)
    .refine(
      (files) => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সমর্থিত।"
    ),
});

type FormState = {
  message: string;
  data?: HandwritingExtractorOutput;
  issues?: string[];
};

export async function extractHandwritingAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  const photoFiles = formData.getAll("photos");

  const validatedFields = HandwritingExtractorActionSchema.safeParse({
    photos: photoFiles,
  });


  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
    };
  }
  
  try {
    const { photos } = validatedFields.data;

    const photoDataUris = await Promise.all(
        photos.map(async (photo: File) => {
            const photoBuffer = Buffer.from(await photo.arrayBuffer());
            return `data:${photo.type};base64,${photoBuffer.toString('base64')}`;
        })
    );
    
    const result = await handwritingExtractor({ photoDataUris });

    if (result) {
      return {
        message: "success",
        data: result,
      };
    } else {
        return { message: "Failed to extract text from the image. Please try again." }
    }
  } catch (error) {
    console.error("Handwriting extraction error:", error);
    if (error instanceof Error) {
        // Check for specific Genkit/Google AI errors if possible
        if (error.message.includes("unexpected response")) {
             return { message: `সার্ভার থেকে একটি অপ্রত্যাশিত প্রতিক্রিয়া এসেছে। অনুগ্রহ করে একটি একটি করে ছবি চেষ্টা করুন অথবা ছবির সংখ্যা কমান।` };
        }
        return { message: `An unexpected error occurred: ${error.message}` };
    }
    return {
      message: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}
