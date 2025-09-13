
"use server";

import { digitalStampMaker, DigitalStampMakerOutput } from "@/ai/flows/digital-stamp-maker";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const DigitalStampMakerActionSchema = z.object({
  companyName: z.string().min(3, { message: "Please enter a company name." }),
  tagline: z.string().optional(),
  shape: z.enum(['Circle', 'Square', 'Rectangle']),
  style: z.string().min(3, { message: "Please select a style." }),
});

export async function generateStampAction(
  formData: FormData
): Promise<{ success: boolean; data?: DigitalStampMakerOutput; issues?: string[]; fields?: Record<string, string>}> {
  const validatedFields = DigitalStampMakerActionSchema.safeParse({
    companyName: formData.get("companyName"),
    tagline: formData.get("tagline"),
    shape: formData.get("shape"),
    style: formData.get("style"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      issues: validatedFields.error.flatten().fieldErrors as any,
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }
  
  try {
    const result = await digitalStampMaker(validatedFields.data);
    if (result.imageUrl) {
      await saveHistoryAction({
          tool: 'digital-stamp-maker',
          input: validatedFields.data,
          output: result,
      });
      return {
        success: true,
        data: result,
      };
    } else {
        return { success: false, issues: ["Failed to generate stamp. Please try again."] }
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      issues: ["An unexpected error occurred. Please try again."],
    };
  }
}
