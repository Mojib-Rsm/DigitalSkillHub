
"use server";

import { handwritingExtractor, HandwritingExtractorOutput } from "@/ai/flows/handwriting-extractor";
import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const HandwritingExtractorActionSchema = z.object({
  photo: z
    .any()
    .refine((file) => file && file.size > 0, 'অনুগ্রহ করে একটি ছবি আপলোড করুন।')
    .refine((file) => file.size <= MAX_FILE_SIZE, `ছবির আকার 5MB এর বেশি হতে পারবে না।`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
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
  const validatedFields = HandwritingExtractorActionSchema.safeParse({
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
    };
  }
  
  try {
    const { photo } = validatedFields.data;
    
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;

    const result = await handwritingExtractor({ photoDataUri });

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
        return { message: `An unexpected error occurred: ${error.message}` };
    }
    return {
      message: "একটি অপ্রত্যাশিত ত্রুটি ঘটেছে। অনুগ্রহ করে আবার চেষ্টা করুন।",
    };
  }
}
