
"use server";

import { aiTitleGenerator, AiTitleGeneratorOutput } from "@/ai/flows/ai-title-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const AiTitleGeneratorActionSchema = z.object({
  primaryKeyword: z.string().min(3, { message: "Please enter a primary keyword." }),
  targetCountry: z.string().min(2, { message: "Please select a target country." }),
});

export async function generateTitlesAction(
  formData: FormData
): Promise<{ success: boolean; data?: AiTitleGeneratorOutput; issues?: string[], fields?: Record<string,string>}> {
  const validatedFields = AiTitleGeneratorActionSchema.safeParse({
    primaryKeyword: formData.get("primaryKeyword"),
    targetCountry: formData.get("targetCountry"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.flatten().fieldErrors as any,
      fields: Object.fromEntries(formData.entries()) as Record<string,string>,
    };
  }
  
  try {
    const result = await aiTitleGenerator(validatedFields.data);
    if (result.titles && result.titles.length > 0) {
      await saveHistoryAction({
          tool: 'ai-title-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["No titles generated. Please try a different input."] }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
