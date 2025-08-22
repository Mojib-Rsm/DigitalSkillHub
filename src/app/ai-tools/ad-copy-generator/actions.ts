
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

type FormState = {
  message: string;
  data?: AdCopyGeneratorOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateAdCopy(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = AdCopyGeneratorActionSchema.safeParse({
    productName: formData.get("productName"),
    productDescription: formData.get("productDescription"),
    targetAudience: formData.get("targetAudience"),
    platform: formData.get("platform"),
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
    const result = await adCopyGenerator(validatedFields.data);
    if (result) {
      await saveHistoryAction({
          tool: 'ad-copy-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        data: result,
      };
    } else {
        return { message: "Failed to generate ad copy. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
