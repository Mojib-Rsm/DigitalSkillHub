
"use server";

import { oneClickWriter, OneClickWriterOutput } from "@/ai/flows/one-click-writer";
import { z } from "zod";

const OneClickWriterActionSchema = z.object({
  title: z.string().min(10, { message: "Please enter a title with at least 10 characters." }),
});

type FormState = {
  message: string;
  data?: OneClickWriterOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generateArticleAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = OneClickWriterActionSchema.safeParse({
    title: formData.get("title"),
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
    const result = await oneClickWriter(validatedFields.data);
    if (result) {
      return {
        message: "success",
        data: result,
      };
    } else {
        return { message: "Failed to generate the article. Please try again." }
    }
  } catch (error) {
    console.error("One Click Writer error:", error);
    if (error instanceof Error) {
        if (error.message.includes("429") || error.message.includes("503") || error.message.toLowerCase().includes('rate limit')) {
             return { message: "The service is currently overloaded with high demand. Please try again in a few moments." };
        }
        return { message: `An unexpected error occurred: ${error.message}` };
    }
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
