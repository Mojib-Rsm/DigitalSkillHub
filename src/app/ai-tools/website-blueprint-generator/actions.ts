
"use server";

import { websiteBlueprintGenerator } from "@/ai/flows/website-blueprint-generator";
import { z } from "zod";

const WebsiteBlueprintActionSchema = z.object({
  idea: z.string().min(10, { message: "Please describe your idea in at least 10 characters." }),
  targetAudience: z.string().min(3, { message: "Please describe your target audience." }),
  coreFeatures: z.string().min(5, { message: "Please list at least one core feature." }),
});

type FormState = {
  message: string;
  blueprint?: any;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateBlueprintAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = WebsiteBlueprintActionSchema.safeParse({
    idea: formData.get("idea"),
    targetAudience: formData.get("targetAudience"),
    coreFeatures: formData.get("coreFeatures"),
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
    const result = await websiteBlueprintGenerator(validatedFields.data);
    if (result.blueprint) {
      return {
        message: "success",
        blueprint: result.blueprint,
      };
    } else {
        return { message: "Failed to generate blueprint. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
