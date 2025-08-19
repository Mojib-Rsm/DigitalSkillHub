
"use server";

import { privacyPolicyGenerator } from "@/ai/flows/privacy-policy-generator";
import { z } from "zod";

const PrivacyPolicyActionSchema = z.object({
  companyName: z.string().min(3, { message: "Please enter a company name." }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
  dataCollected: z.string().min(10, { message: "Please describe the data you collect." }),
  contactEmail: z.string().email({ message: "Please enter a valid contact email." }),
});

type FormState = {
  message: string;
  policy?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generatePrivacyPolicy(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PrivacyPolicyActionSchema.safeParse({
    companyName: formData.get("companyName"),
    websiteUrl: formData.get("websiteUrl"),
    dataCollected: formData.get("dataCollected"),
    contactEmail: formData.get("contactEmail"),
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
    const result = await privacyPolicyGenerator(validatedFields.data);
    if (result.policy) {
      return {
        message: "success",
        policy: result.policy,
      };
    } else {
        return { message: "Failed to generate policy. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
