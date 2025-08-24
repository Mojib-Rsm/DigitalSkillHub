
"use server";

import { facebookCaptionGenerator, FacebookCaptionGeneratorOutput } from "@/ai/flows/facebook-caption-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const FacebookCaptionGeneratorActionSchema = z.object({
  postTopic: z.string().optional(),
  photo: z
    .any()
    .refine((file) => file?.size > 0, 'অনুগ্রহ করে একটি ছবি আপলোড করুন।')
    .refine((file) => file?.size <= MAX_FILE_SIZE, `ছবির আকার 4MB এর বেশি হতে পারবে না।`)
    .refine(
      (file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সমর্থিত।"
    ),
});


export async function generateFacebookCaptions(
  formData: FormData
): Promise<{ success: boolean; data?: FacebookCaptionGeneratorOutput; issues?: string[]}> {
  const validatedFields = FacebookCaptionGeneratorActionSchema.safeParse({
    postTopic: formData.get("postTopic"),
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.flatten().fieldErrors.photo,
    };
  }
  
  try {
    const { postTopic, photo } = validatedFields.data;
    
    const photoBuffer = Buffer.from(await photo.arrayBuffer());
    const photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;

    const flowInput = { postTopic, photoDataUri };
    const result = await facebookCaptionGenerator(flowInput);

    if (result) {
      await saveHistoryAction({
          tool: 'facebook-caption-generator',
          input: { postTopic: postTopic || 'Image-only caption' },
          output: result,
      });
      return {
        success: true,
        data: result
      };
    } else {
        throw new Error("No captions were generated. Please try a different image or topic.");
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred.";
    throw new Error(errorMessage);
  }
}
