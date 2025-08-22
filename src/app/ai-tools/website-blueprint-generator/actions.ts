
"use server";

import { websiteBlueprintGenerator } from "@/ai/flows/website-blueprint-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const WebsiteBlueprintActionSchema = z.object({
  websiteType: z.string().min(1, { message: "Please select a website type." }),
  otherWebsiteType: z.string().optional(),
  targetAudience: z.string().min(1, { message: "Please select a target audience." }),
  otherTargetAudience: z.string().optional(),
  coreFeatures: z.array(z.string()).min(1, { message: "Please select at least one core feature." }),
  briefDescription: z.string().min(10, { message: "Please describe your idea in at least 10 characters." }),
  language: z.enum(['Bengali', 'English']),
  country: z.string().min(1, { message: "Please select a country." }),
}).refine(data => {
    if (data.websiteType === 'Other' && (!data.otherWebsiteType || data.otherWebsiteType.length < 3)) {
        return false;
    }
    return true;
}, {
    message: "Please enter a custom website type (at least 3 characters).",
    path: ["otherWebsiteType"],
}).refine(data => {
    if (data.targetAudience === 'Other' && (!data.otherTargetAudience || data.otherTargetAudience.length < 3)) {
        return false;
    }
    return true;
}, {
    message: "Please enter a custom target audience (at least 3 characters).",
    path: ["otherTargetAudience"],
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
    otherWebsiteType: formData.get("otherWebsiteType"),
    targetAudience: formData.get("targetAudience"),
    otherTargetAudience: formData.get("otherTargetAudience"),
    coreFeatures: formData.getAll("coreFeatures"),
    briefDescription: formData.get("briefDescription"),
    language: formData.get("language"),
    country: formData.get("country"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        websiteType: formData.get("websiteType"),
        otherWebsiteType: formData.get("otherWebsiteType"),
        targetAudience: formData.get("targetAudience"),
        otherTargetAudience: formData.get("otherTargetAudience"),
        coreFeatures: formData.getAll("coreFeatures"),
        briefDescription: formData.get("briefDescription"),
        language: formData.get("language"),
        country: formData.get("country"),
      }
    };
  }
  
  try {
    const { 
        websiteType, otherWebsiteType, 
        targetAudience, otherTargetAudience, 
        language, country,
        ...rest 
    } = validatedFields.data;

    const finalData = {
        ...rest,
        websiteType: websiteType === 'Other' ? otherWebsiteType! : websiteType,
        targetAudience: targetAudience === 'Other' ? otherTargetAudience! : targetAudience,
        language,
        country
    };

    const result = await websiteBlueprintGenerator(finalData);

    if (result.blueprint) {
      await saveHistoryAction({
          tool: 'website-blueprint-generator',
          input: finalData,
          output: result,
      });
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
