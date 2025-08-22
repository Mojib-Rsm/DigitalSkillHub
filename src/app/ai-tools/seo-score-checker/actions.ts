
"use server";

import { seoScoreChecker, SeoScoreCheckerOutput } from "@/ai/flows/seo-score-checker";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const SeoScoreCheckerActionSchema = z.object({
  content: z.string().min(100, { message: "Please enter at least 100 characters of content." }),
  keyword: z.string().min(3, { message: "Please enter a target keyword." }),
});

type FormState = {
  message: string;
  data?: SeoScoreCheckerOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function checkSeoScoreAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = SeoScoreCheckerActionSchema.safeParse({
    content: formData.get("content"),
    keyword: formData.get("keyword"),
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
    const result = await seoScoreChecker(validatedFields.data);
    if (result) {
      await saveHistoryAction({
          tool: 'seo-score-checker',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        data: result,
      };
    } else {
        return { message: "Failed to analyze SEO score. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
