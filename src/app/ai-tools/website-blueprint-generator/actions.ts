
"use server";

import { websiteBlueprintGenerator } from "@/ai/flows/website-blueprint-generator";
import { z } from "zod";

const WebsiteBlueprintActionSchema = z.object({
  websiteType: z.string().min(1, { message: "Please select a website type." }),
  targetAudience: z.string().min(1, { message: "Please select a target audience." }),
  coreFeatures: z.array(z.string()).min(1, { message: "Please select at least one core feature." }),
  briefDescription: z.string().min(10, { message: "Please describe your idea in at least 10 characters." }),
});

type FormState = {
  message: string;
  blueprint?: any;
  fields?: Record<string, any>;
  issues?: string[];
};

export async function generateBlueprintAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = WebsiteBlueprintActionSchema.safeParse({
    websiteType: formData.get("websiteType"),
    targetAudience: formData.get("targetAudience"),
    coreFeatures: formData.getAll("coreFeatures"),
    briefDescription: formData.get("briefDescription"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        websiteType: formData.get("websiteType"),
        targetAudience: formData.get("targetAudience"),
        coreFeatures: formData.getAll("coreFeatures"),
        briefDescription: formData.get("briefDescription"),
      }
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
