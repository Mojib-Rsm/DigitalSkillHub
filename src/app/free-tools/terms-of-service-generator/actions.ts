
"use server";

import { termsOfServiceGenerator } from "@/ai/flows/terms-of-service-generator";
import { z } from "zod";

const TermsOfServiceActionSchema = z.object({
  companyName: z.string().min(3, { message: "Please enter a company name." }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL." }),
  country: z.string().min(3, { message: "Please enter a country." }),
  contactEmail: z.string().email({ message: "Please enter a valid contact email." }),
});

type FormState = {
  message: string;
  policy?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateTermsOfService(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = TermsOfServiceActionSchema.safeParse({
    companyName: formData.get("companyName"),
    websiteUrl: formData.get("websiteUrl"),
    country: formData.get("country"),
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
    const result = await termsOfServiceGenerator(validatedFields.data);
    if (result.terms) {
      return {
        message: "success",
        policy: result.terms,
      };
    } else {
        return { message: "Failed to generate terms. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
