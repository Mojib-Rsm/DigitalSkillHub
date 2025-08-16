
"use server";

import { domainNameSuggester } from "@/ai/flows/domain-name-suggester";
import { z } from "zod";

const DomainNameSuggesterActionSchema = z.object({
  keywords: z.string().min(3, { message: "Please enter at least one keyword." }),
  tlds: z.string().min(2, { message: "Please enter at least one TLD like .com" }),
});

type FormState = {
  message: string;
  domains?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function suggestDomains(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = DomainNameSuggesterActionSchema.safeParse({
    keywords: formData.get("keywords"),
    tlds: formData.get("tlds"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        keywords: formData.get("keywords") as string,
        tlds: formData.get("tlds") as string,
      }
    };
  }
  
  try {
    const result = await domainNameSuggester(validatedFields.data);
    if (result.domains && result.domains.length > 0) {
      return {
        message: "success",
        domains: result.domains,
      };
    } else {
        return { message: "No domains generated. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
