
"use server";

import { businessNameGenerator } from "@/ai/flows/business-name-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const BusinessNameGeneratorActionSchema = z.object({
  industry: z.string().min(3, { message: "Please enter an industry." }),
  keywords: z.string().min(3, { message: "Please enter at least one keyword." }),
  style: z.string().min(1, { message: "Please select a style." }),
});

type FormState = {
  message: string;
  names?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateNames(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = BusinessNameGeneratorActionSchema.safeParse({
    industry: formData.get("industry"),
    keywords: formData.get("keywords"),
    style: formData.get("style"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        industry: formData.get("industry") as string,
        keywords: formData.get("keywords") as string,
        style: formData.get("style") as string,
      }
    };
  }
  
  try {
    const result = await businessNameGenerator(validatedFields.data);
    if (result.names && result.names.length > 0) {
      await saveHistoryAction({
          tool: 'business-name-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        names: result.names,
      };
    } else {
        return { message: "No names generated. Please try a different input." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
