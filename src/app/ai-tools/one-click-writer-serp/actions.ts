
"use server";

import { oneClickWriterSerp } from "@/ai/flows/one-click-writer-serp";
import { saveHistoryAction } from "@/app/actions/save-history";
import { OneClickWriterSerpInputSchema, type OneClickWriterSerpInput, type OneClickWriterSerpOutput } from "@/ai/schema/one-click-writer-serp";

export async function generateArticleSerpAction(
  input: OneClickWriterSerpInput
): Promise<{ success: boolean; data?: OneClickWriterSerpOutput; issues?: string[] }> {
  
  const validatedFields = OneClickWriterSerpInputSchema.safeParse(input);

  if (!validatedFields.success) {
      return {
          success: false,
          issues: validatedFields.error.flatten().fieldErrors as any,
      };
  }

  try {
    const result = await oneClickWriterSerp(validatedFields.data);
    if (result) {
        await saveHistoryAction({
            tool: 'one-click-writer-serp',
            input: validatedFields.data,
            output: result,
        });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["Failed to generate the article. Please try again."] }
    }
  } catch (error) {
    console.error("One Click Writer (SERP) error:", error);
    if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("503") || error.message.toLowerCase().includes('rate limit')) {
             return { success: false, issues: ["The service is currently overloaded with high demand. Please try again in a few moments."] };
        }
         if (error.message.includes("API key not valid")) {
            return { success: false, issues: ["The Google API key is not valid. Please check your .env configuration."] };
        }
        return { success: false, issues: [`An unexpected error occurred: ${error.message}`] };
    }
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
