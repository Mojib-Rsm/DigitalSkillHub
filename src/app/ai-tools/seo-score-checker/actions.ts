
"use server";

import { seoScoreChecker, SeoScoreCheckerOutput } from "@/ai/flows/seo-score-checker";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const SeoScoreCheckerActionSchema = z.object({
  content: z.string().min(100, { message: "Please enter at least 100 characters of content." }),
  keyword: z.string().min(3, { message: "Please enter a target keyword." }),
});

type SeoScoreCheckerInput = z.infer<typeof SeoScoreCheckerActionSchema>;

export async function checkSeoScoreAction(
  input: SeoScoreCheckerInput
): Promise<{ success: boolean; data?: SeoScoreCheckerOutput; issues?: string[] }> {
  const validatedFields = SeoScoreCheckerActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors.map((e) => e.message),
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
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["Failed to analyze SEO score. Please try again."] }
    }
  } catch (error) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred. Please try again.";
    return { success: false, issues: [errorMessage] };
  }
}
