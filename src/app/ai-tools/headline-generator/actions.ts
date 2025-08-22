
"use server";

import { headlineGenerator } from "@/ai/flows/headline-generator";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const HeadlineGeneratorActionSchema = z.object({
  topic: z.string().min(5, { message: "Please enter a topic." }),
  contentType: z.string().min(3, { message: "Please enter a content type." }),
  tone: z.string().min(3, { message: "Please select a tone." }),
});

type FormState = {
  message: string;
  headlines?: string[];
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateHeadlines(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = HeadlineGeneratorActionSchema.safeParse({
    topic: formData.get("topic"),
    contentType: formData.get("contentType"),
    tone: formData.get("tone"),
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
    const result = await headlineGenerator(validatedFields.data);
    if (result.headlines) {
      await saveHistoryAction({
          tool: 'headline-generator',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        headlines: result.headlines,
      };
    } else {
        return { message: "Failed to generate headlines. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
