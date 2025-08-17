
"use server";

import { facebookCommentGenerator } from "@/ai/flows/facebook-comment-generator";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const FacebookCommentGeneratorActionSchema = z.object({
  postContent: z.string(),
  goal: z.string().optional(),
  photo: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `ছবির আকার 4MB এর বেশি হতে পারবে না।`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "শুধুমাত্র .jpg, .jpeg, .png এবং .webp ফরম্যাট সমর্থিত।"
    ).optional(),
}).refine(data => {
    // If there is no photo, postContent must have at least 10 characters.
    // If there is a photo, postContent can be empty.
    if (!data.photo || data.photo.size === 0) {
        return data.postContent.length >= 10;
    }
    return true;
}, {
    message: "কোনো ছবি না দিলে পোস্টের বিষয়বস্তু কমপক্ষে ১০ অক্ষরের হতে হবে।",
    path: ["postContent"], // Set the error path to the postContent field.
});

type FormState = {
  message: string;
  bengaliSuggestions?: string[];
  englishSuggestions?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateFacebookComments(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = FacebookCommentGeneratorActionSchema.safeParse({
    postContent: formData.get("postContent"),
    goal: formData.get("goal"),
    photo: formData.get("photo"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const { postContent, goal, photo } = validatedFields.data;
    let photoDataUri;

    if (photo && photo.size > 0) {
        const photoBuffer = Buffer.from(await photo.arrayBuffer());
        photoDataUri = `data:${photo.type};base64,${photoBuffer.toString('base64')}`;
    }

    const result = await facebookCommentGenerator({ postContent, goal, photoDataUri });

    if ((result.bengaliSuggestions && result.bengaliSuggestions.length > 0) || (result.englishSuggestions && result.englishSuggestions.length > 0)) {
      return {
        message: "success",
        bengaliSuggestions: result.bengaliSuggestions,
        englishSuggestions: result.englishSuggestions,
      };
    } else {
        return { message: "No suggestions generated. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
