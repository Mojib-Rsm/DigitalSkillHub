
"use server";

import { facebookCommentGenerator } from "@/ai/flows/facebook-comment-generator";
import { z } from "zod";

const FacebookCommentGeneratorActionSchema = z.object({
  postContent: z.string().min(10, { message: "Please enter at least 10 characters for the post content." }),
  goal: z.string().min(3, { message: "Please enter a goal for the comment." }),
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
    const result = await facebookCommentGenerator(validatedFields.data);
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
