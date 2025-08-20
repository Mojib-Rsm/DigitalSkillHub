
"use server";

import { imageToVideoGenerator } from "@/ai/flows/image-to-video-generator";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const ImageToVideoGeneratorActionSchema = z.object({
  prompt: z.string().optional(),
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
  videoUrl?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateVideoFromImage(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = ImageToVideoGeneratorActionSchema.safeParse({
    prompt: formData.get("prompt"),
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        prompt: formData.get("prompt") as string,
      }
    };
  }
  
  try {
    const { prompt, photo } = validatedFields.data;
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;

    const result = await imageToVideoGenerator({ prompt, photoDataUri });
    if (result.videoUrl) {
      return {
        message: "success",
        videoUrl: result.videoUrl,
      };
    } else {
        return { message: "Failed to generate video. Please try again." }
    }
  } catch (error) {
    console.error("Error in generateVideo action:", error);
    if (error instanceof Error) {
        if (error.message.includes("SERVICE_DISABLED") || error.message.includes("Generative Language API has not been used")) {
             return { message: "The required Google API is not enabled. Please enable the 'Generative Language API' in your Google Cloud project and try again." };
        }
        return { message: `An unexpected error occurred: ${error.message}` };
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
