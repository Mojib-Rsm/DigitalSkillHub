
"use server";

import { disclaimerGenerator } from "@/ai/flows/disclaimer-generator";
import { z } from "zod";

const DisclaimerActionSchema = z.object({
  companyName: z.string().min(3, { message: "Please enter a company name." }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
  disclaimerTypes: z.string().min(10, { message: "Please list the types of disclaimers needed." }),
});

type FormState = {
  message: string;
  policy?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateDisclaimer(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = DisclaimerActionSchema.safeParse({
    companyName: formData.get("companyName"),
    websiteUrl: formData.get("websiteUrl"),
    disclaimerTypes: formData.get("disclaimerTypes"),
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
    const result = await disclaimerGenerator(validatedFields.data);
    if (result.disclaimer) {
      return {
        message: "success",
        policy: result.disclaimer,
      };
    } else {
        return { message: "Failed to generate disclaimer. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
