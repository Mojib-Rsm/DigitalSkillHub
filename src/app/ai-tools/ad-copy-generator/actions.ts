
"use server";

import { adCopyGenerator, AdCopyGeneratorOutput } from "@/ai/flows/ad-copy-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const AdCopyGeneratorActionSchema = z.object({
  productName: z.string().min(3, { message: "Please enter a product name." }),
  productDescription: z.string().min(10, { message: "Please enter a product description." }),
  targetAudience: z.string().min(3, { message: "Please describe the target audience." }),
  platform: z.enum(['Facebook Ads', 'Google Ads']),
});

export async function generateAdCopyAction(
  formData: FormData
): Promise<{ success: boolean; data?: AdCopyGeneratorOutput; issues?: string[]; fields?: Record<string, string>}> {
  const validatedFields = AdCopyGeneratorActionSchema.safeParse({
    productName: formData.get("productName"),
    productDescription: formData.get("productDescription"),
    targetAudience: formData.get("targetAudience"),
    platform: formData.get("platform"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.flatten().fieldErrors,
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const result = await adCopyGenerator(validatedFields.data);
    if (result) {
      await saveHistoryAction({
          tool: 'ad-copy-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["Failed to generate ad copy. Please try again."] }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
