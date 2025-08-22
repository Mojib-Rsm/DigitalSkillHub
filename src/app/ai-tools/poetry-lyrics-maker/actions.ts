
"use server";

import { poetryLyricsMaker, PoetryLyricsMakerOutput } from "@/ai/flows/poetry-lyrics-maker";
import { saveHistoryAction } from "@/app/actions/save-history";
import { z } from "zod";

const PoetryLyricsMakerActionSchema = z.object({
  topic: z.string().min(3, { message: "Please enter a topic." }),
  type: z.enum(['Poem', 'Song Lyrics']),
  mood: z.string().min(3, { message: "Please describe a mood." }),
  keywords: z.string().min(3, { message: "Please enter at least one keyword." }),
});

type FormState = {
  message: string;
  data?: PoetryLyricsMakerOutput;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function generatePoetryOrLyrics(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const validatedFields = PoetryLyricsMakerActionSchema.safeParse({
    topic: formData.get("topic"),
    type: formData.get("type"),
    mood: formData.get("mood"),
    keywords: formData.get("keywords"),
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
    const result = await poetryLyricsMaker(validatedFields.data);
    if (result) {
      await saveHistoryAction({
          tool: 'poetry-lyrics-maker',
          input: validatedFields.data,
          output: result,
      });
      return {
        message: "success",
        data: result,
      };
    } else {
        return { message: "Failed to generate content. Please try again." }
    }
  } catch (error) {
    console.error(error);
    return {
      message: "An unexpected error occurred. Please try again.",
    };
  }
}
