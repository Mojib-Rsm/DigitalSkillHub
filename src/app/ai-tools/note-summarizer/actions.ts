
"use server";

import { noteSummarizer } from "@/ai/flows/note-summarizer";
import { z } from "zod";

const NoteSummarizerActionSchema = z.object({
  text: z.string().min(50, { message: "Please enter at least 50 characters of text to summarize." }),
  format: z.enum(['bullet_points', 'paragraph']),
});

type FormState = {
  message: string;
  summary?: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function summarizeText(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = NoteSummarizerActionSchema.safeParse({
    text: formData.get("text"),
    format: formData.get("format"),
  });

  if (!validatedFields.success) {
    const { errors } = validatedFields.error;
    return {
      message: "Validation Error",
      issues: errors.map((issue) => issue.message),
      fields: {
        text: formData.get("text") as string,
        format: formData.get("format") as string,
      }
    };
  }
  
  try {
    const result = await noteSummarizer(validatedFields.data);
    if (result.summary) {
      return {
        message: "success",
        summary: result.summary,
      };
    } else {
        return { message: "Failed to summarize text. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
