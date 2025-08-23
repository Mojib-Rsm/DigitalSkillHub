
"use server";

import { seoKeywordSuggester, SeoKeywordSuggesterOutput } from "@/ai/flows/seo-keyword-suggester";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const SeoKeywordSuggesterActionSchema = z.object({
  topic: z.string().min(3, { message: "Please enter a topic or niche." }),
  targetAudience: z.string().min(3, { message: "Please describe your target audience." }),
});

export async function suggestKeywordsAction(
  formData: FormData
): Promise<{ success: boolean; data?: SeoKeywordSuggesterOutput; issues?: string[]; fields?: Record<string, string>}> {
  const validatedFields = SeoKeywordSuggesterActionSchema.safeParse({
    topic: formData.get("topic"),
    targetAudience: formData.get("targetAudience"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.flatten().fieldErrors as any,
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const result = await seoKeywordSuggester(validatedFields.data);
    if (result.keywords && result.keywords.length > 0) {
      await saveHistoryAction({
          tool: 'seo-keyword-suggester',
          input: validatedFields.data,
          output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["No keywords generated. Please try a different input."] }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
