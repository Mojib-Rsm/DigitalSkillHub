
"use server";

import { facebookCommentGenerator } from "@/ai/flows/facebook-comment-generator";
import { z } from "zod";

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const FacebookCommentGeneratorActionSchema = z.object({
  postContent: z.string().min(10, { message: "Please enter at least 10 characters for the post content." }),
  goal: z.string().optional(),
  photo: z
    .any()
    .refine((file) => !file || file.size === 0 || file.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
    .refine(
      (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
});

type FormState = {
  message: string;
  suggestions?: string[];
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
      issues: errors.map((issue) => issue.path.includes('photo') ? `Photo error: ${issue.message}`: issue.message),
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

    if (result.suggestions && result.suggestions.length > 0) {
      return {
        message: "success",
        suggestions: result.suggestions,
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
