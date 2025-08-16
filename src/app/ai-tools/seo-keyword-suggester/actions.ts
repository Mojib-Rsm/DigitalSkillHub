
"use server";

import { seoKeywordSuggester } from "@/ai/flows/seo-keyword-suggester";
import { z } from "zod";

const SeoKeywordSuggesterActionSchema = z.object({
  topic: z.string().min(3, { message: "Please enter a topic or niche." }),
  targetAudience: z.string().min(3, { message: "Please describe your target audience." }),
});

type FormState = {
  message: string;
  keywords?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function suggestKeywords(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SeoKeywordSuggesterActionSchema.safeParse({
    topic: formData.get("topic"),
    targetAudience: formData.get("targetAudience"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        topic: formData.get("topic") as string,
        targetAudience: formData.get("targetAudience") as string,
      }
    };
  }
  
  try {
    const result = await seoKeywordSuggester(validatedFields.data);
    if (result.keywords && result.keywords.length > 0) {
      return {
        message: "success",
        keywords: result.keywords,
      };
    } else {
        return { message: "No keywords generated. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
