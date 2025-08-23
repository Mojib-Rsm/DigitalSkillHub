
"use server";

import { oneClickWriter, OneClickWriterOutput } from "@/ai/flows/one-click-writer";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const OneClickWriterActionSchema = z.object({
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  contentLength: z.enum(['Short', 'Medium', 'Long']),
  tone: z.enum(['Formal', 'Casual', 'Friendly', 'Professional']),
});

type OneClickWriterInput = z.infer<typeof OneClickWriterActionSchema>;

export async function generateArticleAction(
  input: OneClickWriterInput
): Promise<{ success: boolean; data?: OneClickWriterOutput; issues?: string[] }> {

  const validatedFields = OneClickWriterActionSchema.safeParse(input);

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.errors.map((e) => e.message),
    };
  }
  
  try {
    const result = await oneClickWriter(validatedFields.data);
    if (result) {
        await saveHistoryAction({
            tool: 'one-click-writer',
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
    console.error("One Click Writer error:", error);
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
