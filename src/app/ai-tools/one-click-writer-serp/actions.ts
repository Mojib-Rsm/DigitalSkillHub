
"use server";

import { getSerpAnalysis, generateArticleFromSerp } from "@/ai/flows/one-click-writer-serp";
import { saveHistoryAction } from "@/app/actions/save-history";
import { OneClickWriterSerpInputSchema, type OneClickWriterSerpInput, type OneClickWriterSerpOutput } from "@/ai/schema/one-click-writer-serp";
import { SerpResult } from "@/services/serp-service";


export async function getSerpAnalysisAction(
  input: OneClickWriterSerpInput
): Promise<{ success: boolean; data?: SerpResult[]; issues?: string[] }> {
  const validatedFields = OneClickWriterSerpInputSchema.safeParse(input);

  if (!validatedFields.success) {
      return {
          success: false,
          issues: validatedFields.error.flatten().fieldErrors as any,
      };
  }

  try {
    const results = await getSerpAnalysis(validatedFields.data);
    if (results && results.length > 0) {
      return { success: true, data: results };
    } else {
      return { success: false, issues: ["No search results found for the given keyword. Please try another one."] };
    }
  } catch (error) {
    console.error("SERP Analysis error:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key not valid")) {
        return { success: false, issues: ["The Google API key is not valid. Please check your .env configuration."] };
      }
      return { success: false, issues: [`An unexpected error occurred: ${error.message}`] };
    }
    return { success: false, issues: ["An unexpected error occurred while fetching search results."] };
  }
}


export async function generateArticleFromSerpAction(
  input: OneClickWriterSerpInput,
  serpResults: SerpResult[]
): Promise<{ success: boolean; data?: OneClickWriterSerpOutput; issues?: string[] }> {
  
  const validatedFields = OneClickWriterSerpInputSchema.safeParse(input);

  if (!validatedFields.success) {
      return {
          success: false,
          issues: validatedFields.error.flatten().fieldErrors as any,
      };
  }

  try {
    const result = await generateArticleFromSerp(validatedFields.data, serpResults);
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
        return { success: false, issues: [`An unexpected error occurred: ${error.message}`] };
    }
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
