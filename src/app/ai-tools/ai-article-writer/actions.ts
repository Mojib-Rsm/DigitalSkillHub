
"use server";

import { oneClickWriter } from "@/ai/flows/one-click-writer";
import { saveHistoryAction } from "@/app/actions/save-history";
import type { OneClickWriterInput, OneClickWriterOutput } from "@/ai/flows/one-click-writer";


export async function generateArticleAction(
  input: OneClickWriterInput
): Promise<{ success: boolean; data?: OneClickWriterOutput; issues?: string[] }> {
  
  try {
    const result = await oneClickWriter(input);
    if (result) {
        await saveHistoryAction({
            tool: 'ai-article-writer', // Keep the tool name consistent for history
            input: input,
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
    console.error("AI Article Writer error:", error);
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
